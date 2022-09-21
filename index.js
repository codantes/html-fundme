import { ethers } from "./ethers-5.6.esm.min.js";
import {abi, contractAddress} from "./constants.js"

const   connect   =   async() =>    { 
    if(typeof window.ethereum !== undefined){
        await window.ethereum.request({method : "eth_requestAccounts"});
        connectBtn.innerHTML = "connected";
        window.alert("connected!");
        console.log(window.ethereum);
        } else {
            connectBtn.innerHTML = "please install metamask";
            
        }
}

const listenTransactionMine = (transactionResponse, provider) => {
    console.log(`Minning for ${transactionResponse.hash}...`);
    return new Promise ((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`transaction completed after ${transactionReceipt.confirmations} confirmations...`)
            resolve();
        })
    })
}   

const getBalance = async () => {
    if(typeof window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

const fund = async (ethAmount) => { 
   ethAmount = document.getElementById("ethAmount").value;
   console.log(`funding ${ethAmount}...`);
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();
   console.log(signer);
   const contract = new ethers.Contract(contractAddress, abi, signer);
   try{
    const transactionResponse = await contract.fund({value : ethers.utils.parseEther(ethAmount)});
    await listenTransactionMine(transactionResponse, provider);
    console.log("done!");
   }catch(error){
    console.log(error);
   }
}

const withdraw = async () => {
    if(typeof window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
    
    try{
        const transactionResponse = await contract.withdraw();
        await listenTransactionMine(transactionResponse, provider);
        console.log("withdrawn!");
       }catch(error){
        console.log(error);
       }
    }   
}




const connectBtn = document.getElementById("connect_btn");
connectBtn.onclick = connect
const fundBtn = document.getElementById("fund_btn");
fundBtn.onclick = fund
const balanceBtn = document.getElementById("balance_btn");
balanceBtn.onclick = getBalance
const withdrawBtn = document.getElementById("withdraw_btn");
withdrawBtn.onclick = withdraw