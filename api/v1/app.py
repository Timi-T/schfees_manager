#!/usr/bin/python3
"""
Create Flask instance
Flask is the framework used to test the api calls
"""
from distutils.log import debug
from flask import Flask, make_response, jsonify
from api.v1.views import app_views
from api.v1.views.auth import auth
from flask_login import LoginManager
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = os.getenv('FEES_MAN_SECRET_KEY')
app.register_blueprint(app_views)
app.register_blueprint(auth)
login_manager = LoginManager()
login_manager.login_view = 'auth.log_in'
login_manager.init_app(app)
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

@app.teardown_appcontext
def shutdown_session(error):
    """Close sqlalchemy session after use"""
    from models import storage

    storage.close()

@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5005', debug=True)
