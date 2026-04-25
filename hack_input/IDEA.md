I'm participating in ./HACKATHON.md

The track I'm participating is insurance company and we need to build voice agent which will take insurance claims um by voice call. That's the objective of the hackathon. All details in hackathon.MD.

So the whole user journey will be the following:

- User signs up in my web app.
- They are directed to onboarding page where they select insurance plans, for example car insurance or electronics insurance.
- Then they redirected to main screen, where they see a button, open a claim
- Then it opens a cold screen which looks like a FaceTime, but without video.
- AI agents talk with client and asks details about the case. Then at some moment AI agent understands that it's time for a visual inspection, And it shows a big button on the screen of the phone "Start visual inspection".
- Then AI talks with user and sees the video, asks to show some damage of device.
- At the end of the when all details are already settled, agent says hey I will send you just need to upload invoice for laptop.
- Call ends and user sees half-filled form with details extracted from call. For example, video is attached, summary of the claim insurance policy attached to the majority.
- At bottom of form user uploads the image of invoice to the form and then they submit the claim
- On next screen it shows confirmation. Hey, we'll be back to you in a few hours and your estimate for damage is around 100-300 Euro.
- And for a submitted claim, they of course can go to their private uh dashboard and see all claims that they submitted.

Also I was thinking about how to use internet search for agent. Maybe at the end of the call um agent should go to internet and find the exact product which is claimed for and then find actual prices for new item just to have estimation of the price for client.This should happen right after submission of the form. It should trigger research agents, which will find the price, and then it should generate a very custom message for client saying something like this: "Hey, our estimated damage is like 100 Euro and the to buy new product it costs 400 Euro so you can expect in in successful case you can expect around one hundred Euro to be returned to you."

That was the user journey for the demo. Right now I want you to design the architecture of the app.
So agent should automatically match policy of insurance to the context of current voice session. For example, client can choose at the end of the onboarding, hey, I have insurance of car and also of electronics and then during call, a agent will try to understand if their policy matches their current request.

It also should show a button for visual inspection only in 2 cases:

- The agent sees in a policy description that visual inspection is required for this particular policy
- User triggers visual inspection by voice. Uh user can say hey, I can actually show you something.

In both cases, the agent needs to call a tool which will send me some API request with a session ID So that I can show this button in real time.

Technology:

- Gemini 3.1 Flash Live for voice and video call
- Gemini for end image generate
- https://www.tavily.com/?utm_source=luma for internet search

Already set-up with all envs and deployments:

- Convex for backend
- react + nextjs
- clerk for auth

Remember that should be a mobile-friendly design, because it will be presented from the phone.

Now take this idea and think about how to design a really good demo experience. Take a look at hackathon file. Take a look at winning criteria and just then X my plan in terms of how it will be a wow effect for juries, how to make it very good. Is there anything i am missing?

Create a new plan file.
You can also take a look at research folder which has hackathon partners.
