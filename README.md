# otembaTryOutUpdater
# Simple html page app to issue REST requests to Otemba.io
If you want to try Otemba.io or need an example of using the REST interface, this is a good place to start.

A typical workflow with the simple HTML page:

# You may expect:
1. runs on localhost of your machine (open it from the fs in a browser)
2. uses the pre release server (currently on port 81)
3. "Create new Contract" issues a CREATE REST-request (updates the address in the right panel)
4. "Update Contract" issues a READ or UPDATE request (depending on the flow element in the right panel)
5. as a suggestion: when you recompile your Contract, you may exchange the elements "data" and "ABI" in the files json/deployJson.js (CREATE) and json/updateJson.js (UPDATE)
6. as a suggestion: you may want to reuse an existing address after a CREATE by editing the field "mining.contractAddress" in json/updateJson.js so that it is immediately available after you reload the page

# Do not expect:
1. compiling of your Solidity Contract code or ..
2. debugging of your Contract
3. validation of your REST requests

![alt text](https://github.com/Otemba/otembaTryOutUpdater/blob/master/otembaTryOutUpdater/userInteraction.png "Workflow diagram.")

Image: The red dots symbolize a reload of the html page in your browser. In the state "Fill json request" you push the buttons on the upper right panel. Then by hitting "Update" in the left panel, a request is sent to the Otemba.io REST server. 