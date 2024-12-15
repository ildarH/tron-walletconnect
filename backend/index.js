// index.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const port = 3001;

const crypto = require('crypto');
const ethers = require('ethers');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TronWeb } = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
});

