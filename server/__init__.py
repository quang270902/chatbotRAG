from flask import Flask
from flask_cors import CORS
import os


def create_app():
    app = Flask(__name__)    
    #if os.environ.get('FLASK_ENV') == 'development':
# Cấu hình CORS cho toàn bộ ứng dụng
    CORS(app)

    #CORS(app)
    from server.api.routes import api_blueprint
    app.register_blueprint(api_blueprint)
    return app