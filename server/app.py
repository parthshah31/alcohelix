from flask import Flask, abort, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_guid import GUID
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from collections import defaultdict
import uuid
import requests
import datetime
import pytz
from functools import wraps
from config import AUTH_URL, MAILGUN_DOMAIN, MAILGUN_API_KEY

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    kerberos = db.Column(db.String(20), unique=True, nullable=False)
    secret = db.Column(GUID(), unique=True, nullable=False)
    weight = db.Column(db.Integer)
    is_male = db.Column(db.Boolean)

class Drink(db.Model):
    __tablename__ = 'drink'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    time = db.Column(db.DateTime(timezone=True))

@app.route('/')
def home():
    return abort(404)

VALID_GENDERS = ['male', 'female']

@app.route('/api/account', methods=['POST'])
def account():
    kerberos = request.form.get('kerberos')
    if kerberos is None:
        return 'Needs kerberos', 401
    if len(kerberos) > 20:
        return 'Kerberos too long', 401
    try:
        weight = int(request.form.get('weight', None))
    except (ValueError, TypeError):
        return 'Invalid weight', 401

    if request.form.get('gender') not in VALID_GENDERS:
        return 'Invalid gender', 401
    is_male = request.form.get('gender') == 'male'

    try:
        user = db.session.query(User).filter_by(kerberos=kerberos).one()
    except NoResultFound:
        user = User(kerberos=kerberos, secret=uuid.uuid4(), weight=weight, is_male=is_male)
        try:
            db.session.add(user)
            db.session.commit()
        except IntegerityError:
            db.session.rollback()
            user = db.session.query(User).filter_by(kerberos=kerberos).one()


    url = AUTH_URL.format(user.secret)

    text_message = f"""
    Welcome to Alcohelix!

    Drinking in our DNA. Please see the <strong>secret</strong> link below to access your portal.

    {url}
    """
    html_message = f"""
    <h1>Welcome to Alcohelix!</h1>
    <p>Drinking in our DNA. Please see the <strong>secret</strong> link below to access your portal</p>
    <p><a href="{url}">{url}</a></p>
    """

    ### send the email
    r = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=('api', MAILGUN_API_KEY),
        data={
            'from': f"Alcohelix <alcohelix@{MAILGUN_DOMAIN}>",
            'to': f"{user.kerberos}@mit.edu",
            'subject': 'Alcohelix Magic Link',
            'text': text_message,
            'html': html_message
        }
    )

    if r.status_code != 200:
        app.logger.warn(f"failed to send mail {user.kerberos} - {r.text}")
        return "Email failed", 501
    else:
        return "", 200


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user = db.session.query(User).filter_by(secret=request.headers.get('x-user-secret')).one()
        except NoResultFound:
            return abort(401)

        g.user = user
        return f(*args, **kwargs)
    return decorated_function

EST = pytz.timezone('US/Eastern')
EPOCH = datetime.datetime(1970, 1, 1, tzinfo=pytz.utc)

@app.route('/api/tonight')
@login_required
def tonight():
    start = datetime.datetime.now().replace(hour=12+5, minute=0, second=0, microsecond=0, tzinfo=EST)
    if datetime.datetime.now().hour <= 12 + 5:
        start -= datetime.timedelta(days=-1)
    end = start + datetime.timedelta(days=1)

    ud_pairs = db.session.query(User, Drink.time).filter(and_(Drink.time >= start, Drink.time <= end)).group_by(Drink.user_id).all()

    user_histories = defaultdict(list)
    users = {}
    
    for user, drink in ud_pairs:
        users[user.id] = user
        # TODO whack
        user_histories[user.id].append((drink.replace(tzinfo=pytz.utc) - EPOCH).total_seconds())

    for uid in users:
        user_histories[uid].sort()

    result = {
        "users": [
            {
                "kerberos": user.kerberos,
                "gender": 'male' if user.is_male else 'female',
                "weight": user.weight,
                "history": user_histories[user.id]
            }
            for user in users.values()
        ]
    }

    return jsonify(result)

@app.route('/api/tonight/me')
@login_required
def tonight_me():
    start = datetime.datetime.now().replace(hour=12+5, minute=0, second=0, microsecond=0, tzinfo=EST)
    if datetime.datetime.now().hour <= 12 + 5:
        start -= datetime.timedelta(days=-1)
    end = start + datetime.timedelta(days=1)

    me = g.user

    drinks = db.session.query(Drink.time).filter(and_(Drink.user_id == me.id, Drink.time >= start, Drink.time <= end)).all()

    history = [(drink[0].replace(tzinfo=pytz.utc) - EPOCH).total_seconds() for drink in drinks]
    history.sort()

    result = {
        "kerberos": me.kerberos,
        "gender": 'male' if me.is_male else 'female',
        "weight": me.weight,
        "history": history
    }

    return jsonify(result)


@app.route('/api/drinks', methods=['POST'])
@login_required
def add_drink():
    epoch_time = request.form.get('time') # time in seconds from UNIX epoch
    if not epoch_time:
        return "Needs time", 500

    try:
        epoch_time_int = int(epoch_time)
    except ValueError:
        return "Can't parse time", 500

    if epoch_time_int < 0:
        return "Invalid time", 500

    timestamp = datetime.datetime.fromtimestamp(epoch_time_int).replace(tzinfo=pytz.utc)

    drink = Drink(user_id=g.user.id, time=timestamp)
    db.session.add(drink)
    db.session.commit()
    
    return "", 200

if __name__ == '__main__':
    app.run(debug=True)
