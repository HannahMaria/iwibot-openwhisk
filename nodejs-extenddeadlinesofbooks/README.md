# Extend Deadlines of Books
This action allows you to extend the deadlines of the wanted (oder “respective”) books.

## How to Use
(First Scenario)

1. First you need to login
2. Then you can ask the bot to extend ALL your books.
3. If you have borrowed books and the action is successful, you will get a list of all of your books with the new deadlines.

When there is a deadline which is still the same, it's possible that there is no opportunity to extend the deadline of the special book.

(Second Scenario)

1. First you need to Login
2. Then you can ask the bot to extend your books.
3. The bot will ask you for what books you want to extend.
4. For the action to be successfull the signatures of your books must be divided by commas.
5. If you borrowed books and the action is successful, you will get a list of all of your books with the new deadlines.

When there is a deadline which is still the same, it's possible that there is no opportunity to extend the deadline of the defined book.

(Scenario of Wrong UserInput)

The action only notes valid Inputs. If the input isn't a valid signature or the user hasn't borrowed the book, the action won't crash.

## The Conversation Service
Which orders does the action understand?
- Kannst du @Alle meine Bücher verlängern?
- Kannst du meine Bücher verlängern?
- Verlängere @Alle Buch?
- Verlängere @Alle meine Bücher?

What means @Alle?

The action waits for the words alle, jedes and so on. When these words are found the action uses the keyword 'all' and extends all Books.

And without?

Without the keyword all, the action asks for userInput and uses everything you say. But it hopes for booksignatures to be seperated by a comma.

## How does it work

Same as borrowedBooks action decryption -> (The action relies on the user to login to the frontend first. If you’re not logged in, it answers with
a petition response to do so. The login-information is sent by the frontend via the library_credetials, enrcypted and splitted into a sessionId, an initial vector and the
encrypted data. Encryption or decryption works via the nodejs-keys action. To decrypt, the server is called with the given sessionId and this returns a
cryptoKey which will be used to decrypt the data again.)

After the decryption of the data, the data will be filtered for which books you wanted to extend. Now there are two opportunities:
1. You said at the first call of the function you want to extend all books.

    -> The parameter 'all' is given via the entities and can be used directly.

2. You said not which books you would like to extend.

    -> If the userInput includes no comma, the Action will use it directly (for example, if you gave only one book to extend).
    
    -> If the userInput includes commas, the Action has to split it up and the resulting array will be used (You gave more than one book to extend).

After the userInput has been defined, it will be used to do the PUT-Request. The response contains all! borrowed books. If you have no books borrowed,
the answer is empty. In order to present the user only significant data, the list will be filtered again.
- If all books have been extended, no further filtering is necessary.
- However, if only certain books have been extended, they will be sorted out of the list and only these are displayed to you.

At least the answer of the IWIBot becomes defined, it is split into the payload and the htmlText. The htmlText is a list in which the title of the books
being represented as a heading.