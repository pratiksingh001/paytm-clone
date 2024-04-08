const express = require("express");

const {connectDB, User} = require('./db.js');

connectDB();
User();

