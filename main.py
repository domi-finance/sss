import asyncio
import json
import logging
import time

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes, MessageHandler, filters
import requests
import config

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to the JSON files
USER_DATA_FILE = 'users_json.json'
TICKET_DATA_FILE = 'tickets_json.json'

# Helper function to load JSON data
def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

# Helper function to save JSON data
def save_json_data(data, file_path):
    # old_data = load_json_data(TICKET_DATA_FILE)
    # print("Old data", old_data)
    # print("New ", data)

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# Helper function to create a unique ticket ID
def create_ticket_id():
    return f"ticket_{int(time.time())}"

# Command handler for /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    user_data = load_json_data(USER_DATA_FILE)

    welcome_message = (
        f"Hey @{user.username}, welcome to TGM.BET! 🎉\n\n"
        "⚡️ Lightning-Fast Withdrawals, Immediate Payouts! ⚡️\n"
        "🎟 Win Million Dollar Prizes for Free! 🎟\n"
        "📅 Daily Logins: Unleash Bonuses and Rewards Non-Stop! 🎁\n"
        "🔐 Total Privacy: No KYC Needed, Stay Anonymous! 🕵️‍♂️\n"
        "🚪 Hassle-Free Play: No Registration, Jump Right In! 🎮\n"
        "📲 Telegram Mini Program: Tap, Play, and Win! 🎯\n\n"
        "🌟 $TGM—TGM.Bet’s Native Token, Skyrocketing in Value! 🚀💸\n\n"
        "Join Now and Hit the Jackpot! ⤵️⤵️"
    )

    # Check if the user is already in the JSON file
    unique_id = f"tgm_{user.id}"
    if unique_id not in user_data:
        user_data[unique_id] = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'unique_id': unique_id
        }
        save_json_data(user_data, USER_DATA_FILE)

    # Create inline buttons
    keyboard = [
        [InlineKeyboardButton("🇬🇧 English - Channel", url=config.TGM_ENGLISH_CHAT),
         InlineKeyboardButton("中文 - 频道 🇨🇳", url=config.TGM_CHINESE_CHAT)],
        [InlineKeyboardButton("🎰 Bet Now!", web_app=WebAppInfo(url=config.TGM_WEBAPP)),
         InlineKeyboardButton("💲 Buy $TGMB", callback_data='buy_tgmb')],
        [InlineKeyboardButton("👥 Earn as Affiliate", callback_data='earn_affiliate')],
        [InlineKeyboardButton("📞 Live Support", callback_data='contact_support')]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    # Send welcome message with a GIF
    await update.message.reply_document(document=config.ANIMATION_GIF, caption=f'{config.TGM_EMBED_IMAGE}{welcome_message}',
                        parse_mode="HTML",
                        reply_markup=reply_markup)

    # message = await update.message.reply_text('Choose an option:', reply_markup=reply_markup)
    # await context.bot.edit_message_text(
    #     chat_id=message.chat_id,
    #     message_id=message.message_id,
    #     text=f"{config.TGM_EMBED_IMAGE}{welcome_message}",
    #     parse_mode="HTML",
    #     disable_web_page_preview=False,
    #     reply_markup=reply_markup
    # )

# Callback handler for inline buttons
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    user_id = query.message.chat.id
    await query.answer()

    data = query.data
    if data == 'contact_support':
        await query.message.chat.send_message(text="We usually reply within 24 hours. Please type in your message here, and our support will reach out to you.")
        ticket_data = load_json_data(TICKET_DATA_FILE)
        user_id = str(query.message.chat.id)
        print(user_id)
        ticket_data[user_id] = {
        'user_id': user_id,
        'username': "",
        'first_name': "",
        'last_name': '',
        'message': '',
        'ticket_id': '',
        "awaiting_support_message": None }

        save_json_data(ticket_data, TICKET_DATA_FILE)
        print(ticket_data, "Done saving !!")

    elif data == 'buy_tgmb':
        await query.edit_message_text(text="You selected 'Buy $TGMB'")
    elif data == 'earn_affiliate':
        await query.edit_message_text(text="You selected 'Earn as Affiliate'")

# Message handler to process user messages for support
async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # if update.message is None or update.message.text is None:
    #     return

    ticket_data = load_json_data(TICKET_DATA_FILE)
    tg_data = update.to_dict()
    if tg_data.get("channel_post"):
        if "reply_to_message" in tg_data.get("channel_post"):
            user_message=tg_data.get('channel_post').get('reply_to_message').get('text').split('\n')
            user_id = None
            for messages in user_message:
                if "User ID:" in messages:
                    user_id = messages.split(':')[1]

            support_message = tg_data.get('channel_post').get('text')


            if user_id:
                if support_message =="close":
                    user_id = user_id.strip()
                    ticket_id = None
                    for tid, data in ticket_data.items():
                        if data['user_id'] == int(user_id):
                            ticket_id = tid
                            break

                    if ticket_id:
                        del ticket_data[user_id]
                        save_json_data(ticket_data, TICKET_DATA_FILE)
                        await context.bot.send_message(chat_id=config.SUPPORT_CHANNEL_ID, text="User Ticket have been closed !")

                        # Send the message to the user channel
                        await context.bot.send_message(chat_id=int(user_id), text="Your tickect have been closed !")
                        return
                    else:
                        await context.bot.send_message(chat_id=config.SUPPORT_CHANNEL_ID, text="No open ticket found.")
                        return

                # Send the message to the user channel
                await context.bot.send_message(chat_id=int(user_id), text=support_message)

                #update the the ticket from  awaiting message so user can engage
                ticket_data = load_json_data(TICKET_DATA_FILE)

                user_id = user_id.strip()
                if user_id in ticket_data:

                    ticket_data[user_id]['awaiting_support_message'] = False
                    save_json_data(ticket_data, TICKET_DATA_FILE)



    if update.message is None or update.message.text is None:
        return
    user_id = str(update.effective_user.id)

    if user_id in ticket_data and ticket_data[user_id]['awaiting_support_message'] is None:
        user = update.effective_user
        user_id = str(user.id)
        user_message = update.message.text
        ticket_id = create_ticket_id()
        ticket_data[user_id] = {
            'user_id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'message': user_message,
            'ticket_id': ticket_id,
            "awaiting_support_message":True
        }
        save_json_data(ticket_data, TICKET_DATA_FILE)

        support_message = (
            f"{'--' * 15}\n"
            f"New support ticket from @{user.username}:\n\n"
            f"First Name: {user.first_name}\n"
            f"Last Name: {user.last_name}\n"
            f"User ID: {user.id}\n"
            f"Ticket ID: {ticket_id}\n"
            f"Message: {user_message}\n"
            f"Status: New Ticket"
            f"{'--'*15}\n"
            f"Action:Please Respond directly to this message or contact user through username here -> @{user.username}"
        )

        # Send the message to the support channel
        await context.bot.send_message(chat_id=config.SUPPORT_CHANNEL_ID, text=support_message)

        await update.message.reply_text(text="Your message has been sent to our support team. We will get back to you shortly.")
        await update.message.reply_text(text="You can type /cancel to close this ticket.")

    elif user_id in ticket_data and not ticket_data.get(user_id).get('awaiting_support_message'):
        current_ticket_id = ticket_data.get(user_id).get('ticket_id')
        user = update.effective_user
        user_message = update.message.text
        support_message = (
            f"{'--' * 15}\n"
            f"New support ticket from @{user.username}:\n\n"
            f"First Name: {user.first_name}\n"
            f"Last Name: {user.last_name}\n"
            f"User ID: {user.id}\n"
            f"Ticket ID: {current_ticket_id}\n"
            f"Message: {user_message}\n"
            f"{'--' * 15}\n"
            f"Status: Ongoing Ticket\n"
            f"Action:Please Respond directly to this message or contact user through username here -> @{user.username}"
        )

        # Send the message to the support channel
        await context.bot.send_message(chat_id=config.SUPPORT_CHANNEL_ID, text=support_message)

        # await update.message.reply_text(
        #     text="Your message has been sent to our support team. We will get back to you shortly.")
        await update.message.reply_text(text="You can type /cancel to close this ticket/Conversation.")

        pass
    else:
        try:
            user_id = str(update.effective_user.id)
            current_ticket_id = ticket_data.get(user_id).get('ticket_id')
            await update.message.reply_text(text=f"You can't open more than one ticket wait for support team to open your ticket 😄 your current tikect is {current_ticket_id}")
        except:
            pass

# Helper function to get user info by ticket ID
def get_user_info_by_ticket_id(ticket_id):
    ticket_data = load_json_data(TICKET_DATA_FILE)
    return ticket_data.get(ticket_id)


# Custom filter to check if a message is a reply
def reply_filter(update: Update):
    return update.message.reply_to_message is not None



# Message handler to process replies from support
async def reply_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:

    if update.message.reply_to_message:  # Check if it's a reply
        replied_message_text = update.message.reply_to_message.text
        ticket_id = replied_message_text.split('\n')[0].strip('-')  # Assuming ticket ID is the first line

        user_info = get_user_info_by_ticket_id(ticket_id)
        if user_info:
            user_id = user_info['user_id']
            reply_message = update.message.text

            await context.bot.send_message(chat_id=user_id, text=reply_message)
            await update.message.reply_text("Reply sent to the user.")


# Command handler for /cancel
async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:

    user = update.effective_user
    ticket_data = load_json_data(TICKET_DATA_FILE)


    # If the command is used without arguments (user action)
    ticket_id = None
    for tid, data in ticket_data.items():
        if data['user_id'] == user.id:
            ticket_id = tid
            break

    if ticket_id:
        del ticket_data[ticket_id]
        save_json_data(ticket_data, TICKET_DATA_FILE)
        await update.message.reply_text(text="Your ticket has been closed. Thank you for contacting support.")
    else:
        await update.message.reply_text(text="No open ticket found.")


# Main function to start the bot
def main() -> None:
    """Run the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(config.TGM_TOKEN).build()

    # Add handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CallbackQueryHandler(button_callback))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))
    application.add_handler(CommandHandler('cancel', cancel))


    # Run the bot
    application.run_polling()

if __name__ == '__main__':
    # Run the bot
    main()
