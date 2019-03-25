## HsKA IWIBot AlexaSkill
This is an Amazon AlexaSkill for the IWIBot of the HsKA. This skill gets you information about your timetable, todays meal, consultation hours, lectures and the semesters. 


## Workflow
The Amazon Alexa Skill recognizes a user input speech and sends a JSON-Request with the users input as a slot to IBMCloud function AlexaSkill. The function calls the router with the input speech and the conversation service classifies the intent. The appropriate function is called and the response is sent back to the AlexaSkill function. A JSON-Response is built with the response from the function and sent back to the skill. 
[See for Alexa Request and Response](https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html)


## Create a AlexaSkill
- if you don't already have an Amazon Developer Account go to [developer.amazon.com](https://developer.amazon.com), create a free account and log in to your account.
- you should now see four different sections. Go to the Amazon Alexas section, click on **Skill Builders** in the upper left navigation and hit the **Start a Skill** button.
- now you can create a skill in your amazon developer console. To do that click **Create Skill**, enter a name for your skill, select your default language, select **Custom** for your model and **Self Hosted** for your host method. To confirm click on **Create Skill**.

1. **setting an invocation name:** In the left sidebar got to `Interaction Model -> Invocation` and enter a name.
2. **create a slot type:** In the *Interaction Model* tab click `Add` right next to slot types and enter a name for the slot type. You can choose any name you want. Click on `Create custom slot type` and enter a sample value like *"hello world"*.
3. **create an intent:** in the Interaction Model click Add right next to the intents and enter the name `EveryThingIntent`. Click `Create custom intent` and enter `{EveryThingSlot}` as a sample utterance. It should pop up a window `Select an Existing Slot` with a button `Add`. Hit the button and confirm your utterance with the `+` on the right side. Now you should see your slot under the Intent Slots. Select your created slot type from step 2 for the EveryThingSlot. 
4. **save the model:** click on `Save Model` at the top. 
5. **set endpoint:** the endpoint is the ibmcloud function `AlexaSkill`. Go to your bluemix console and navigate to `Actions -> AlexaSkill -> Endpoints` and copy the Web Action Url ending with `.json`. Back to your skill Go to the *Endpoint* tab, select `HTTPS`, paste in the url for the default region and select `My development endpoint is a sub-domain of a domain...`. Click `Save Endpoint`, go to the *Invocation* tab and click `Build Model` (can take a few seconds).
6. **get skill id:** to be able to verify if a request is from the Alexa skill you need to copy the skill id to `serverless.yaml`. Go to your [skills overview](https://developer.amazon.com/alexa/console/ask) and click `View Skill ID` below your skill. Copy the id and paste it in for the `alexa_application_id parameter`.
7. **test the skill:** before testing, the AlexaSkill function need to be deployed with the new alexa_application_id. If the function is deployed you can test your skill in the Alexa simulation. Go to `Test` in the top navigation. Select `Development` for Skill testing and now you can talk or write your request for the IWIBot. 
8. **make skill public:** to make the skill available for everyone follow the steps in the `Distribution` menu.