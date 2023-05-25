# Pudu Contracts
Welcome to the Pudu Contracts repository!, This repository houses the smart contracts that power the **$PUDU** cryptocurrency.

# Testing
To ensure the reliability and integrity of our smart contracts, we have included comprehensive automated tests. These tests can be found in the **/test** folder, To execute them follow these steps:

1. Navigate to the root directory of the repository.
2. Install the required dependencies by running the following command:
    ```
    npm install
    ```
3. Compile our Smart Contracts
    ```
    npx hardhat compile
    ```
4. Once the dependencies are installed and contracts are compiled run the tests using the following command:
    ```
    npx hardhat test --network hardhat
    ```

