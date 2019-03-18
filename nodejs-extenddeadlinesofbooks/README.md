# Extend Deadlines Of Books
With this Action you can extend the deadlines for the books you want to.

## How to use
(First Scenario)
1. First you need to Login
2. Then you can ask the Bot to extend ALL your Books.
3. If you have borrowed Books and the Action is successful, you will get a list of all of your Books with the new Deadlines.
 When the're is a Deadline which is still the same, it's possible that there is no opportunity to extend the Deadline of the special Book. 
 
(Second Scenario)
1. First you need to Login
2. Then you can ask the Bot to extend your Books.
3. The Bot will ask you for what Books you want to extend.
4. For the Success of the Action you have to answer with the Signatures of your Books, seperated by commas.
5. If you have borrowed Books and the Action is successful, you will get a list of all of your Books with the new Deadlines.
 When there is a Deadline which is still the same, it's possible that there is no opportunity to extend the Deadline of the special Book. 
 
 
(Scenario of Wrong UserInput)

The Action only note valid Inputs. So if the input isn't a valid Signature or the User haven't borrow the Book, there action won't crash.

## How does it work
Same as borrowed Books Action decryption -> (The Action relies on the User to login to the frontend first. If you have not logged in, it answers with 
a petition to do so. The Login-information is sent by the frontend via the library_credetials, enrcypted and splitted into a sessionId, an iv and the 
encrypted data. Encryption or decryption works via the nodejs-keys Action. To decrypt the server is called with the given session ID and this returns a 
cryptoKey which will be used to decrypted the data again.)

After the decryption of the data, the data will be filtered for which books you wanted to extend. Now there are two Opportunities:

1. You said at the first call of the function you want to extend all books.

    -> The parameter 'all' is given via the entities and can be used directly.

2. You said not which books you would like to extend.

    -> If the UserInput includes no comma, the Action will use it directly (You gave only one Book to Extend).
     
    -> If the UserInput includes commas, the Action have to split it and the result Array will be used (You gave more than one Book to extend).
    
    
    
After the UserInput has been defined, it will be used to do the PUT-request. The response contains all! borrowed books. If you have no books borrowed,
the answer is empty. In order to present the user only significant data, the list will be filtered again.
- If all books have been extended, no further filtering is necessary.
- However, if only certain books have been extended, they will be sorted out of the list and only these are displayed to you.

At least the answer of the IwiBot becomes defined, it is split into the payload and the htmlText. The htmlText is a list in which the title of the books
 being represented as a heading.

