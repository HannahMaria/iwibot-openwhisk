# Borrowed Books
With this action you can see all your borrowd books.

## How to use
1. First you need to Login
2. Then you can ask the bot for your borrowed books.
3. If you have borrowed books and the action is successful, you will get a list of all of your Books.

When you have no borrowd Books the Bot will inform you about.

## The Conversation Service
Which orders does the action understand?
- Habe ich aktuell Bücher ausgeliehen?
- Welche Bücher habe ich aus der Bibliothek noch ausgeliehen?
- Welche Bücher habe ich ausgeliehen?
- Welche Bücher muss ich der Bibliothek zurückgeben?

## How does it work

Same as extend deadlines of Books Action decryption -> (The action relies on the user to login to the frontend first. If you’re not logged in, it answers with 
a petition response to do so. The login-information is sent by the frontend via the library_credetials, enrcypted and splitted into a sessionId, an initial vector and the 
encrypted data. Encryption or decryption works via the nodejs-keys action. To decrypt, the server is called with the given sessionId and this returns a
cryptoKey which will be used to decrypt the data again.)

If the data is decrypted, the function sends a GET-Request to the REST-Api. The response includes all your borrowed books. If you have no borrowed
books, the answer is empty.

At least the answer of the IWIBot becomes defined, it is split into the payload and the htmlText. The htmlText is a list in which the title of the books
being represented as a heading. 