import { IIdentifier, VerifiableCredential, VerifiablePresentation } from '@veramo/core'
import express, { NextFunction } from 'express'
import { getAgent, setupAgent } from './../veramo/setup'
import * as middlewares from './../middlewares'

const router = express.Router()

type CredentialResponse = string[]

router.use(middlewares.init)
router.post('/register/', async (req, res) => {
  console.log('body' + JSON.stringify(req.body))

  let agent = await getAgent()
  let identifier = await agent.didManagerCreate({
    kms: 'local',
    provider: 'did:pkh',
    options: { network: 'eip155', chainId: '1' },
  })
  const credential = await agent.createVerifiableCredential({
    proofFormat: 'jwt',
    credential: {
      credentialSubject: {
        id: req.body.identifier,
        loginName: req.body.loginName,
      },
      type: ['SiteLoginCredential'],
      issuer: identifier.did,
    },
  })

  console.log(JSON.stringify(credential))
  res.json(credential)
})

router.post('/signIn', async (req, res) => {
  console.log('presentation:' + JSON.stringify(req.body.presentation))
  let agent = await getAgent()

  let verifiablePresentation: VerifiablePresentation = req.body
    .presentation as VerifiablePresentation

  // We verify the presentation is signed by the user
  let verified = await agent.verifyPresentation({
    presentation: verifiablePresentation,
  })

  if (verified){
    if (verifiablePresentation.verifiableCredential?.length !== 1) {
      res.json({verified: false, message: "Invalid Presentation: we are expecting a single credential"});
    }

    let credential: VerifiableCredential = verifiablePresentation.verifiableCredential?.pop() as VerifiableCredential;
    if (!credential.type?.includes("SiteLoginCredential")){
      res.json({verified: false, message: "Invalid Credential: we are expecting a credential with type SiteLoginCredential"});
    }

    let verificationResponse = null;
    try {
      verificationResponse = await agent.verifyCredential({ credential });
      console.log(verificationResponse.error?.message);
    } catch(e){
      res.sendStatus(500).json({verified: false, message: e});
    }

    if (!verificationResponse?.verified){
      res.json({verified: false, message: `Invalid Credential: ${verificationResponse?.error?.message}`});
    } else {
      res.json({ verified: true});
    }
  } 
})

export default router

