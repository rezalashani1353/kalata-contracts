// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

interface ICollateral {

    function updateConfig(address stakingContract, address[] memory assets, uint[] memory unlockSpeeds) external;

    function deposit(address asset, uint amount) external;

    function withdraw(address asset, uint amount) external;

    function reduceUnlockedAmount(address depositor, address asset, uint unlockedAmount) external;

    function queryDeposit(address depositor, address asset) external view returns (uint amount, uint blockNumber);

    function queryUnlockedAmount(address depositor, address asset) external view returns (uint);

    function queryConfig() external view returns (address stakingContract, address[] memory assets, uint[] memory unlockSpeeds);
}

