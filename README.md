# Hangman Game

## Information
Guess a randomly picked word within 5 times, or be hung... Good luck! 😃

## To run locally
Install dependencies:
- `pipenv install`

Run the flask webserver
- `pipenv run serve`

## Check it out live on Heroku
https://ischouten-hangman.herokuapp.com

## Run from cli:
`pipenv run python cli.py` (make sure to have run `pipenv install` first.)

## Deploy to heroku

1. Make sure requirements are frozen. `pipenv lock`
2. Make sure frontend is built for production `cd react-ui && yarn build`
3. Push to heroku. `git push heroku master`

## Notes

- Devices without a physical keyboard are currently not supported.
