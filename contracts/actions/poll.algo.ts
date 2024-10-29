import { Contract } from '@algorandfoundation/tealscript';

// action contracts exist to formally manage interactible social elements of akita
// they embed gate checking logic

export class PollAction extends Contract {
    programVersion = 10;

}