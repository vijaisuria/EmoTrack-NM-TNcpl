# routes/__init__.py

from .auth_routes import auth_routes
from .emotion_routes import emotion_routes

# Optionally, you can define a function to initialize all the Blueprints
def init_app(app):
    app.register_blueprint(auth_routes, url_prefix='/auth')
    app.register_blueprint(emotion_routes, url_prefix='/emotrack')


