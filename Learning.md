# Stripe subscription 

## How Subscription work 

https://stripe.com/docs/billing/subscriptions/overview

* Landing page
    - User create on backendd
    - User create on stripe. receive(customerid)

* Pricing page 
    - Display the products and pricing option retrived from stripe. receive (priceid)

* Payment page
    - Collect billing details and payment details 
        - create new subscription ( customerid, priceid )
        - generate invoice for initial subscription cycle
        - collects payment details and pays your invoice 
        - sets the payment method as default payment method for subscription.

* Provisioning page
    - confirmation page 
    - provision product access to the customer
        - verify status of subscription is 'active'

    - Handle webhooks called by stripe about subscriptions and payments    

## Build a subscription integration

https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements#collect-payment

User auth flow

```mermaid
sequenceDiagram
participant User
participant Frontend
participant Backend
participant Stripe API

User ->> Frontend  : open UI
Frontend -->> Frontend : Check auth status

note right of Frontend : Check auth state
alt Auth invalid 
    Frontend -->> Frontend : Show Login page
    User ->> Frontend : Login
    Frontend ->> Backend : Login 
    Backend -->> Frontend: Auth token  
else Auth valid
    Frontend -->> Frontend : Show Logged in pages
    Frontend -->> Frontend : Auth token
end

```

User's stripe user get and create

```mermaid
sequenceDiagram
participant User
participant Frontend
participant Backend
participant Stripe Api

User ->> Frontend  : open Subscription Pricing page
Frontend -->> Frontend : get user
Frontend ->> Backend : get User API
Backend ->> UserStore : get User
UserStore -->> Frontend : return User or empty

alt User stripe account details not available 
    Frontend -->> Backend: create Stripe user
    Backend -->> Stripe Api : create stripe user
    Backend -->> UserStore : update user with stripe user details
else User stripe account details available
    Frontend -->> Backend : get stripe user
    Backend -->> Stripe Api : get stripe user
end

```

User's excisting subscriptions

```mermaid
sequenceDiagram
participant User
participant Frontend
participant Backend
participant Stripe Api

Frontend -->> Backend : get stripe user

Frontend -->> Backend : get stripe user's subscriptions
Backend -->> SubscriptionStore : get user's subscriptions
Backend -->> Frontend : user's subscriptions
Frontend -->> Frontend : display existing subscriptions. 
Frontend -->> Frontend : if no subscriptions, displays pricing to subcribe

```
