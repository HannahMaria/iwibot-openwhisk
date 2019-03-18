# Borrowed Books
With this Action you can see all your borrowd booka.

## How to use
1. First you need to Login
2. Then you can ask the Bot for your borrowd Books.
3. If you have borrowed Books and the Action is successful, you will get a list of all of your Books.
 When you have no borrowd Books the Bot will inform you about.

## How does it work
Same as extend DEadlines of Books Action decryption -> (The Action relies on the User to login to the frontend first. If you have not logged in, it answers with 
a petition to do so. The Login-information is sent by the frontend via the library_credetials, enrcypted and splitted into a sessionId, an iv and the 
encrypted data. Encryption or decryption works via the nodejs-keys Action. To decrypt the server is called with the given session ID and this returns a 
cryptoKey which will be used to decrypted the data again.)

If the data is decrypted, the function sends a GET-request to the REST-Api. The response includes all your borrowed books. If you have no borrowed 
books, the answer is empty. 
At least the answer of the IwiBot becomes defined, it is split into the payload and the htmlText. The htmlText is a list in which the title of the books
 being represented as a heading.

