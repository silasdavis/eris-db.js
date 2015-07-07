contract Test {

    event GotOwner(uint indexed timeStamp);

    address owner;

    function Test(){
        owner = msg.sender;
    }

    function add(int a, int b) external constant returns (int sum) {
        return a + b;
    }

    function() constant returns (address theOwner){
        GotOwner(block.timestamp);
        return owner;
    }

}