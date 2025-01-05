from server import create_app
from flask_sqlalchemy import SQLAlchemy

app = create_app()
#migrate = Migrate(app, db)
if __name__ == '__main__':
    app.run(debug=True)