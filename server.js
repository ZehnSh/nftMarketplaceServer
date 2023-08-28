//0x348F704faEBF7Cf415dE593D8b786FcfF492F186
const express = require('express');
const cors = require('cors');
const ABI = require('./ABI.json');

const { Web3 } = require('web3');

const app = express();
app.use(cors());

const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/w1GMOzJZxqiQwDCHF412EaSPw3Bx0_sK");
const contractAddress = "0x348F704faEBF7Cf415dE593D8b786FcfF492F186";
const contract = new web3.eth.Contract(ABI, contractAddress);

app.get("/user-all-tokens/:address", async (req, res) => {
    try {
        const address = req.params.address;
        const tokens = await contract.methods.userOwnedNFT(address).call();
        console.log(tokens);
        if (tokens.length === 0) {
            res.status(200).json({ status: 200, message: "Tokens Not Exist" });
        } else {
            const tokensList = tokens.map(({ tokenId, tokenURI }) => {
                const id = Number(tokenId);
                return { id, tokenURI }
            })
            res.status(200).json({ status: 200, tokensList, message: "Tokens Exist" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error });
    }
});

app.get("/view-all-listed-nft", async (req, res) => {
    try {
        const NFTs = await contract.methods.getAllListedNFT().call();
        if (NFTs.length === 0) {
            res.status(201).json({ status: 201, message: "No NFTs Listed" });
        } else {
            const listedNFT = NFTs.map(({ owner, tokenId, uri, price }) => {
                const id = Number(tokenId);
                const nftPrice = Number(price);
                return { owner, id, uri, nftPrice }
            })
            console.log(listedNFT);
            res.status(200).json({ status: 200, listedNFT, message: "NFTs List Exist" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error });
    }

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})