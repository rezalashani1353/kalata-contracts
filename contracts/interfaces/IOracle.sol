// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

interface IOracle {
    function queryAllPrices() external view returns (
        address[] memory assets,
        uint[] memory prices,
        uint[] memory lastUpdatedTimes
    );

    function queryPrice(address asset) external view returns (
        uint price,
        uint lastUpdatedTime
    );
}


