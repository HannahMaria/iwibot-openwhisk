# Library Information
With this Action you can see how much space is in the library.

## How to use
(First Scenario)
1. Ask the bot for the space in a SPECIAL library in Karlsruhe.
2. If the action is successful, you will get the information how much seats are occupied and how much are free.

(Second Scenario)
1. Ask the bot for the space in library in Karlsruhe.
2. The bot will ask you in which library you're going to go to
3. You can answer with all libraries in Karlsruhe the bot know.
4. If the action is successful, you will get the information how much seats are occupied and how much are free.

## The Conversation Service
Which orders does the action understand?
- Ist die @Bibliothek schon voll?
- Ist in @Bibliothek noch Platz?
- Lohnt es sich in die @Bibliothek zu gehen?
- Wie viel ist in @Bibliothek los?
- ...

What means @Bibliothek?

The action waits for an userInput. Possible inputs: LSG, LSN, LBS, FBC, LAF, FBW, FBP, FBI, FBM, FBA, BIB-N, FBH, TheaBib, FBD, LST, LSW (or different versions of the long term).
These are the short versions of the library names.
## How does it work
The action sends a GET-Request with the chosen library to the REST-Api. The response includes timestamps with the information about the seat
situation in the given library.

