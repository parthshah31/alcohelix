from flask import Flask, abort, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_guid import GUID
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
import uuid
import requests
from config import AUTH_URL, MAILGUN_DOMAIN, MAILGUN_API_KEY

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    kerberos = db.Column(db.String(20), unique=True, nullable=False)
    secret = db.Column(GUID(), unique=True, nullable=False)

class Drink(db.Model):
    __tablename__ = 'drink'
    id = db.Column(db.Integer, primary_key=True)
    user_id = Column(db.Integer, db.ForeignKey('user.id'))
    time = Column()

@app.route('/')
def home():
    return abort(404)

@app.route('/api/account', methods=['POST'])
def account():
    kerberos = request.form.get('kerberos')
    if kerberos is None:
        return 'Needs kerberos', 401
    if len(kerberos) > 20:
        return 'Kerberos too long', 401
    try:
        user = db.session.query(User).filter_by(kerberos=kerberos).one()
    except NoResultFound:
        user = User(kerberos=kerberos, secret=uuid.uuid4())
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
            'from': f"Alcohelix <noreply@{MAILGUN_DOMAIN}>",
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


@app.route('/api/tonight')
def tonight():
    return 'hello'

if __name__ == '__main__':
    app.run(debug=True)
