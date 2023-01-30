import { IIdentifier, VerifiablePresentation } from '@veramo/core';
import express, { NextFunction } from 'express';
import { getAgent, setupAgent } from './../veramo/setup';
import * as middlewares from './../middlewares';

const router = express.Router();

type CredentialResponse = string[];

router.use(middlewares.init);
router.post('/register/', async (req, res) => {
  
  console.log('body' + JSON.stringify(req.body));

  let agent = await getAgent();
  let identifier = await agent.didManagerCreate({ kms: 'local', provider: 'did:pkh', options: { network: 'eip155', chainId: "1"} });
  const credential = await agent.createVerifiableCredential({
    proofFormat: 'jwt',
    credential: {
      credentialSubject: { id: req.body.identifier, loginName: req.body.loginName },
      type: ['Login'],
      issuer: identifier.did,
    },
  })
  
  console.log(JSON.stringify(credential));
  res.json(credential);
});

router.post('/signIn', async (req, res) => {
  console.log('presentation:' + JSON.stringify(req.body.presentation));
  let agent = await getAgent();

  let verifiablePresentation: VerifiablePresentation = req.body.presentation as VerifiablePresentation;

  let verified  = await agent.verifyPresentation({ presentation: verifiablePresentation});


  res.json(verified.verified);
});

export default router;
function getAgentIdentifier() : Promise<IIdentifier>{
  throw new Error('Function not implemented.');
}

function getUserIdentifier() : Promise<IIdentifier>{
  throw new Error('Function not implemented.');
}
