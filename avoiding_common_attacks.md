# Avoiding Common Attacks

The contract would be suseptible to overflow/underflow attacks as it take user input and relies heavily on uints

- A Zeplin libray contract called SafeMath is used to prevent underflow/overflow attacks since the voting function can take inputs for uint types.