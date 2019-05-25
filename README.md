# Hangman Game

## To run locally

`pipenv run serve`

## Deploy to heroku

1. Make sure requirements are frozen. `pipenv lock`
2. Make sure frontend is built for production `cd react-ui && yarn build`
3. Push to heroku. `git push heroku master`
