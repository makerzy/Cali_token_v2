// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract CallsReply {
    // just for contract test purpose
    event CallReceived(address origin, uint256 amount, bytes data);

    function onTokenApproval(
        address origin,
        uint256 amount,
        bytes calldata data
    ) external returns (bool) {
        IERC20(msg.sender).transferFrom(origin, address(this), amount);
        emit CallReceived(origin, amount, data);
        return true;
    }

    function onTokenTransfer(
        address origin,
        uint256 amount,
        bytes calldata data
    ) external returns (bool) {
        IERC20(msg.sender).transfer(msg.sender, amount);
        emit CallReceived(origin, amount, data);
        return true;
    }
}
