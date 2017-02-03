from app import app

from flask import Flask, render_template, request, redirect, jsonify, url_for, flash

@app.route('/')
@app.route('/index')
def index():
    return render_template('main.html',
                            development=True,)

@app.route('/about')
def about():
    return render_template('about.html',
                            development=True,)
