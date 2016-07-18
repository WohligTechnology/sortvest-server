rm -rf .tmp/public
nodemon  --max-old-space-size=2096 app.js --prod
