# Hangman Game

## Information

Guess a randomly picked word within 5 times, or be hung... Good luck! 😃

## To run locally

### Install dependencies for backend (python, flask application):

- `pipenv install`
- `pipenv run serve` to run the server (on port 5000)

### Install dependencies for frontend (react-ui)

- `cd react-ui`
- `yarn install`
- `yarn start` to serve the frontend (on port 3000).

## Check it out live on Heroku

https://ischouten-hangman-dev.herokuapp.com

## Run from cli:

`pipenv run python cli.py` (make sure to have run `pipenv install` first.)

## Deploy to heroku

1. Make sure requirements are frozen. `pipenv lock`
2. Push to heroku. `git push heroku master`

### Development release

- heroku create ischouten-hangman-dev --remote develop
- git remote add heroku-dev https://git.heroku.com/ischouten-hangman-dev.git

To push and create a build for development:

- git push heroku-dev develop:master

## Notes

- Devices without a physical keyboard are currently not supported.
