# TGM.BET Telegram Bot

![TGM BET GIF](https://github.com/tgm-labs/TGM.BET/blob/main/TGM.gif)

TGM.BET is a Telegram bot designed to provide information and interactive features related to TGM.BET. The bot is built using Python and the `python-telegram-bot` library.

## Project Structure

- `venv/`: Directory for the virtual environment.
- `Base_LOGO.png`: Base logo image for TGM.BET.
- `config.py`: Configuration file containing settings such as the Telegram bot token and GIF URL.
- `main.py`: Main script for the bot functionality.
- `main_logo.png`: Main logo image for TGM.BET.
- `model.py`: Placeholder for any model-related code (currently empty).
- `ReadMe.md`: This file.
- `requirements.txt`: List of required Python packages.
- `TGM.gif`: Placeholder for GIF (currently not used).
- `users_json.json`: JSON file storing user data.

## Setup

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd TGM.BET
    ```

2. **Create a Virtual Environment:**

    ```bash
    python -m venv venv
    ```

3. **Activate the Virtual Environment:**

    - On Windows:

        ```bash
        venv\Scripts\activate
        ```

    - On macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

4. **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5. **Configure the Bot:**

    Edit the `config.py` file to include your Telegram bot token and other configuration details. Ensure that the `TGM_TOKEN` variable contains your bot's token.

6. **Run the Bot:**

    ```bash
    python main.py
    ```

## Usage

- **/start**: Initializes the bot and sends a welcome message with options.
- **Inline Buttons**: The bot provides various interactive options via inline buttons. Users can choose between channels, bet options, affiliate programs, and contact support.

## Files

- **`config.py`**: Contains the bot token and other configuration parameters. Ensure to hide sensitive information like the bot token.
- **`main.py`**: Main script that handles the bot's logic and interactions.
- **`users_json.json`**: Stores user data to keep track of users who have interacted with the bot.

## Example Code

The following code snippet shows how to configure the bot and handle user interactions:

```python
import asyncio
import json
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import requests
import config

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to the JSON file
USER_DATA_FILE = 'users_json.json'

# Helper functions
def load_user_data():
    try:
        with open(USER_DATA_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_user_data(data):
    with open(USER_DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

def download_gif(url, save_path):
    response = requests.get(url)
    with open(save_path, 'wb') as file:
        file.write(response.content)

# Command handler for /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # Implementation of start command
    pass

# Callback handler for inline buttons
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # Implementation of button callback
    pass

# Main function to start the bot
def main() -> None:
    application = Application.builder().token(config.TGM_TOKEN).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CallbackQueryHandler(button_callback))
    application.run_polling()

if __name__ == '__main__':
    main()
