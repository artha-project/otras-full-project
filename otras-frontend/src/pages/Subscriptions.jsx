import { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, CheckCircle2, Zap, Sparkles } from "lucide-react";
import TierCard from "../components/TierCard";
import { useTranslation } from "../hooks/useTranslation";

export default function Subscriptions({ user }) {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [userCredits, setUserCredits] = useState(user?.credits || 0);

useEffect(()=>{
fetchPlans();
},[]);

const fetchPlans=async()=>{
try{
const response=await axios.get("http://localhost:4000/subscriptions");
setPlans(response.data);
}catch(error){
console.error("Failed to fetch subscription plans",error);
}
finally{
setLoading(false);
}
};

  // Refresh user credits upon mounting
  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:4000/users/${user.id}`).then(res => {
        if (res.data?.credits !== undefined) {
          setUserCredits(res.data.credits);
        }
      }).catch(err => console.error(err));
    }
  }, [user?.id]);

  const handlePayWithCredits = async (plan) => {
    try {
      setProcessingId(`credit-${plan.id}`);
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:4000/payments/pay-with-credits", {
        subscriptionId: plan.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message || "Subscription activated using credits!");
      setUserCredits(res.data.remainingCredits);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to purchase plan with credits.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePay = async (plan) => {
    if (plan.price === 0) {
      alert("This is a free plan. You're already good to go!");
      return;
    }

    try {
      setProcessingId(plan.id);
      
      const token = localStorage.getItem("token");
      
      // 1. Create Order on Backend
      const orderRes = await axios.post("http://localhost:4000/payments/create-order", {
        subscriptionId: plan.id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "OTRAS Subscription",
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await axios.post("http://localhost:4000/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.message === 'Payment verified successfully') {
              alert("Payment Successful! Your subscription is now active.");
              // Optionally refresh user state or UI here
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        console.error("Payment failed", response.error);
        alert(response.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Something went wrong initializing the payment.");
    } finally {
      setProcessingId(null);
    }
  };

return(

<div className="space-y-10">

{/* HEADER */}

<div>

<h1 className="page-title flex items-center gap-3">

<CreditCard
size={32}
style={{color:"var(--color-primary)"}}
/>

{t("subscriptionPlans")}

</h1>

<p className="text-subtle">
{t("pickPlan")}
</p>

</div>



{/* PLAN GRID */}

{loading ? (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

{[1,2,3].map(i=>(
<div
key={i}
className="app-card h-[420px] animate-pulse"
/>
))}

</div>

) : plans.length>0 ? (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

{plans.map(plan=>(
<TierCard
key={plan.id}
tier={plan.name}
price={plan.price===0?"Free":`₹${plan.price}`}
duration={plan.duration||"Lifetime"}
              features={plan.features || [
                "AI Career Mapping",
                "OTR Profile Identity",
                "Basic Exam Notifications",
                "Community Access"
              ]}
              onPay={() => handlePay(plan)}
              onCreditPay={() => handlePayWithCredits(plan)}
              isProcessing={processingId === plan.id || processingId === `credit-${plan.id}`}
              showCreditOption={plan.price > 0}
              planPrice={plan.price}
            />
          ))}

</div>

) : (

<div className="app-card p-16 text-center border-dashed">

<Sparkles
size={48}
className="mx-auto mb-4"
style={{color:"var(--text-muted)"}}
/>

<p className="text-subtle font-medium">
{t("noPlansFound")}
</p>

</div>

)}



{/* BENEFITS SECTION */}

<div
className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
style={{background:"var(--sidebar-bg)",color:"white"}}
>

{/* glow background */}

<div
className="absolute"
style={{
top:-80,
right:-80,
width:250,
height:250,
background:"var(--color-primary)",
opacity:.2,
borderRadius:"50%",
filter:"blur(60px)"
}}
/>


<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">

{/* LEFT BENEFITS */}

<div>

<h2 className="section-title mb-6 text-white">
{t("whyUpgrade")}
</h2>

<div className="space-y-6">

{[
{
title:t("aiAdaptiveTesting"),
desc:t("aiAdaptiveDesc")
},
{
title:t("advancedEligibilityMatrix"),
desc:t("advancedEligibilityDesc")
},
{
title:t("prioritySupport"),
desc:t("priorityDesc")
}
].map((benefit,i)=>(

<div key={i} className="flex gap-4">

<div
className="flex items-center justify-center rounded-lg"
style={{
width:40,
height:40,
background:"rgba(255,255,255,.08)"
}}
>
<CheckCircle2 size={20}/>
</div>

<div>

<h4 className="font-semibold mb-1">
{benefit.title}
</h4>

<p
className="text-sm"
style={{color:"rgba(255,255,255,.7)"}}
>
{benefit.desc}
</p>

</div>

</div>

))}

</div>

</div>



{/* RIGHT FEATURE CARD */}

<div
className="rounded-xl p-8 border"
style={{
background:"rgba(255,255,255,.05)",
borderColor:"rgba(255,255,255,.1)"
}}
>

<div className="flex items-center gap-4 mb-6">

<div
className="flex items-center justify-center rounded-full"
style={{
width:48,
height:48,
background:"rgba(6,182,212,.15)",
color:"var(--color-cyan)"
}}
>
<Zap size={24}/>
</div>

<div>

<p
className="label"
style={{color:"var(--color-cyan)"}}
>
{t("powerFeature")}
</p>

<h3 className="card-title text-white">
{t("intelligenceEngine")}
</h3>

</div>

</div>

<p
className="text-sm mb-6"
style={{color:"rgba(255,255,255,.75)"}}
>
{t("intelligenceEngineDesc")}
</p>

<div className="progress-bar">

<div
className="progress-fill"
style={{
width:"75%",
background:"var(--color-cyan)"
}}
/>

</div>

<div className="flex justify-between mt-2">

<span
className="label"
style={{color:"rgba(255,255,255,.6)"}}
>
{t("accuracy")}
</span>

<span
className="label"
style={{color:"var(--color-cyan)"}}
>
{t("reliable")}
</span>

</div>

</div>

</div>

</div>

</div>

);

}
