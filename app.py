from flask import Flask, render_template
from get_endpoints import get_routes
from post_endpoints import post_routes
from utils import data_directory
import os

app = Flask(__name__)

app.register_blueprint(get_routes)
app.register_blueprint(post_routes)

@app.route('/')
def index():
    supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
    return render_template('index.html', supernovae=supernovae)

if __name__ == "__main__":
    app.run(debug=True)
