# Design Pattern Decisions

### Prepared for Failure
A Circuit Breaker was implemented to halt the contract in the event of a attack.

_A sybil attack is enivitable in this current version of the contract as it is cheap to generate identities (addresses) that can be used to register and obtain Voice Credits._

This is why an identity system like http://humanitydao.org would be best to be implemented in a voting system or something along the lines of PGP's web-of-trust.

###### NOTICE
The goal of this project was to demonstrate specifically the system of quadratic voting and isn't design to be an identity system. In fact it would be better suited as a library contract that can be utilised by other systems which need such a voting mechanism.