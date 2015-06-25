contract Test {
    address owner;

    function Test(){
        owner = msg.sender;
    }

    function add(int a, int b) returns (int ret){
        return a + b;
    }

    function() returns (address addr){
        return owner;
    }
}