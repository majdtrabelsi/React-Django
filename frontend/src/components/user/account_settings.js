import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/main.css';
import './styles/bootstrap.min.css';

function SettingAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          navigate('/');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.isAuthenticated) {
          navigate('/');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching authentication status:", error);
        setIsLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountdatas/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setAccountType(data.account_type);
      })
      .catch((err) => {
        console.error("Error fetching account data:", err);
      });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'Billing':
        return <Billing setActiveTab={setActiveTab} accountType={accountType} />;
      case 'BillingHistory':
        return <BillingHistory />;
      case 'Subscription':
        return <SubscriptionManagement accountType={accountType} setActiveTab={setActiveTab} />;
      case 'ChangePassword':
        return <ChangePassword />;
      case 'TwoFA':
        return <TwoFATab />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl py-6">
        <div className="container">
          <div className="text-center">
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Account Setting</div>
            <h2 className="mb-5">Manage Your Account</h2>
          </div>

          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="d-flex justify-content-center">
              {['dashboard', 'Billing', 'BillingHistory', 'Subscription', 'ChangePassword', 'TwoFA'].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-outline-primary mx-2 ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}


const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // === Fetch card info ===
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/billing/status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCardInfo(data))
      .catch(() => setCardInfo(null));
  }, []);

  // === Fetch subscription info ===
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/subscription/status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setSubscriptionInfo(data))
      .catch(() => setSubscriptionInfo(null));
  }, []);

  // === Fetch account data ===
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountdatas/', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch account data');
        return res.json();
      })
      .then((data) => {
        setAccountData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load account info.');
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (accountData) {
      const { account_type, is_paid, date_joined } = accountData;
      const joinedDate = new Date(date_joined);
      const now = new Date();
      const ageInDays = Math.floor((now - joinedDate) / (1000 * 60 * 60 * 24));
      const isCompany = account_type === 'company';
      const trialExpired = isCompany && !is_paid && ageInDays > 15;


      if (trialExpired) {
        const timeout = setTimeout(() => {
          navigate('/payment');
        }, 5000);
        return () => clearTimeout(timeout);
      }
    }
  }, [accountData, navigate]);

  if (loading) return <div className="text-center my-5">Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!accountData) return <div className="text-center my-5">No account data available.</div>;

  const {
    username,
    last_login,
    date_joined,
    account_type,
    subscription_due,
    first_name,
    last_name,
    is_paid,
  } = accountData;

  const joinedDate = new Date(date_joined);
  const now = new Date();
  const accountAgeInDays = Math.floor((now - joinedDate) / (1000 * 60 * 60 * 24));
  const isCompany = account_type === 'company';
  const trialExpired = isCompany && !is_paid && accountAgeInDays > 15;
  const trialStartDate = joinedDate.toLocaleDateString();
  const trialEndDate = new Date(joinedDate.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString();

  if (trialExpired) {
    return (
      <div className="alert alert-danger text-center my-5">
        ⛔ Your 15-day free trial has expired.<br />
        Please subscribe to continue using your account.<br />
        <small>Redirecting to payment page...</small>
      </div>
    );
  }

  const isPremium = ['professional', 'company'].includes(account_type);
  const loyaltyMessage = accountAgeInDays >= 365
    ? "🎉 You've been with us for over a year — we appreciate your loyalty!"
    : accountAgeInDays >= 180
      ? "🥳 6 months already? You're amazing!"
      : accountAgeInDays >= 90
        ? "🔥 3 months strong! Thanks for sticking around!"
        : accountAgeInDays >= 30
          ? "🎈 1 month milestone — thanks for being here!"
          : null;

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mb-3 shadow-sm">
          <div className="card-body text-center">
            <h4 className="card-title mb-3">👤 Welcome, {first_name + ' ' + last_name}</h4>
            <p><strong>Registration Email :</strong> {username}</p>
            <p><strong>Last Visit:</strong> {new Date(last_login).toLocaleDateString()}</p>
            <p><strong>Account Type:</strong> {account_type}</p>
            <p><strong>Joined:</strong> {joinedDate.toLocaleDateString()}</p>
            {isCompany && !is_paid && (
                <div className="alert alert-info mt-3">
                    🧪 <strong>Trial Period</strong><br />
                    Started on : {trialStartDate} <br />
                    Ends on : {trialEndDate} <br />
                    {trialExpired ? (
                    <span style={{ color: 'red' }}>Your trial has expired.</span>
                    ) : (
                    <span>Days left : {15 - accountAgeInDays}</span>
                    )}
                </div>
                )}


            {loyaltyMessage && (
              <div className="alert alert-success mt-3">
                {loyaltyMessage}
              </div>
            )}

            {subscriptionInfo && subscriptionInfo.plan !== 'Free' ? (
              <p><strong>Subscription ends on:</strong> {new Date(subscriptionInfo.renewal_date).toLocaleDateString()}</p>
            ) : (
              <p><strong>Subscription:</strong> <span style={{ color: `red` }}>No Active Subscription</span></p>
            )}

            {isPremium && subscription_due && (
              <div className="alert alert-warning mt-3">
                ⚠️ Your subscription is due! Please update your billing information to avoid downgrade.
              </div>
            )}

            {isPremium && !cardInfo?.has_credit_card && (
              <div className="alert alert-info mt-3">
                💳 No credit card on file. <br />Add one in the Billing tab for automatic subscription renewals.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




function CreditCardForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
  });

  const getCardType = (number) => {
    if (/^3[47]/.test(number)) return 'amex'; // American Express
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    return 'unknown';
  };

  const isValidLuhn = (number) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
    }

    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (name === 'cvv') {
      const cardType = getCardType(formData.cardNumber);
      const maxLen = cardType === 'amex' ? 4 : 3;
      value = value.replace(/\D/g, '').slice(0, maxLen);
    }

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const cardNumberValid = formData.cardNumber.length >= 13 && isValidLuhn(formData.cardNumber);
    const expiryValid = /^\d{2}\/\d{2}$/.test(formData.expiry);
    const cvvValid = (() => {
      const cardType = getCardType(formData.cardNumber);
      const length = formData.cvv.length;
      return cardType === 'amex' ? length === 4 : length === 3;
    })();

    setErrors({
      cardNumber: !cardNumberValid,
      expiry: !expiryValid,
      cvv: !cvvValid,
    });

    return cardNumberValid && expiryValid && cvvValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-50 text-start">
      <div className="mb-3">
        <label className="form-label">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="4242 4242 4242 4242"
          required
        />
        {errors.cardNumber && <div className="invalid-feedback">Invalid card number</div>}
      </div>

      <div className="d-flex gap-3">
        <div className="mb-3 flex-grow-1">
          <label className="form-label">Expiry</label>
          <input
            type="text"
            name="expiry"
            className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            required
          />
          {errors.expiry && <div className="invalid-feedback">Invalid expiry</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">CVV</label>
          <input
            type="text"
            name="cvv"
            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
            value={formData.cvv}
            onChange={handleChange}
            placeholder="CVV"
            required
          />
          {errors.cvv && <div className="invalid-feedback">Invalid CVV</div>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-2">Submit</button>
    </form>
  );
}
// === BILLING SETTINGS ===
const Billing = () => {
  const [status, setStatus] = useState('');
  const [cardInfo, setCardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/billing/status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCardInfo(data))
      .catch(() => setCardInfo(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  const handleFormSubmit = (formData) => {
    fetch('http://localhost:8000/api/accounts/billing/update/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setStatus('✅ Billing information updated!');
        setCardInfo(data);
        setShowForm(false);
        window.location.reload()
      })
      .catch(() => setStatus('❌ Error updating billing info.'));
  };

  const handleDelete = () => {
    fetch('http://localhost:8000/api/accounts/billing/delete/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(res => res.json())
      .then(() => {
        setCardInfo(null);
        setStatus('💥 Credit card deleted.');
      })
      .catch(() => setStatus('❌ Failed to delete card.'));
  };

  if (loading) return <div className="text-center">Loading billing info...</div>;

  return (
    <center>
      <div>
        <h3 className="mb-4">Billing Settings</h3>

        {cardInfo?.has_credit_card ? (
          <>
            <div className="card w-50 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">💳 Card on File</h5>
                <p><strong>Last 4 digits:</strong> **** **** **** {cardInfo.card_last4}</p>
                <p><strong>Expiry:</strong> {cardInfo.expiry}</p>
                <p><strong>Added:</strong> {new Date(cardInfo.added_at).toLocaleDateString()}</p>

                <button className="btn btn-outline-secondary me-2" onClick={() => setShowForm(!showForm)}>
                  ✏️ {showForm ? 'Cancel' : 'Modify'}
                </button>
                <button className="btn btn-outline-danger" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </div>
            </div>

            {showForm && (
              <div className="mt-4">
                <CreditCardForm onSubmit={handleFormSubmit} />
              </div>
            )}
          </>
        ) : (
          <CreditCardForm onSubmit={handleFormSubmit} />
        )}

        {status && <div className="mt-3 alert alert-info">{status}</div>}
      </div>
    </center>
  );
};

const BillingHistory = () => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/billing/history/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        // Filter out duplicates by checking Stripe Invoice ID
        const uniqueData = Array.from(new Set(data.map(a => a.stripe_invoice_id)))
                               .map(id => {
                                 return data.find(a => a.stripe_invoice_id === id)
                               });
        setHistory(uniqueData);
      })
      .catch(err => console.error("Error loading history:", err));
  }, []);
  
  return (
    <div>
      <h3>Billing History</h3>
      {history.length === 0 ? (
        <p>No billing records found.</p>
      ) : (
        <ul className="list-group">
          {history.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{new Date(item.created_at).toLocaleDateString()} — {item.description} — ${item.amount}</span>
              <a
                href={item.stripe_invoice_url || `https://dashboard.stripe.com/invoices/${item.stripe_invoice_id}`}
                className="btn btn-outline-primary btn-sm"
                target="_blank"
                rel="noopener noreferrer"
            >
            View Invoice
            </a>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const SubscriptionManagement = ({ accountType, setActiveTab }) => {
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [csrf, setCsrfToken] = useState();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch("http://localhost:8000/api/accounts/csrf/", {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => setCsrfToken(data.csrfToken));
    }, []);
  
    useEffect(() => {
      fetch("http://localhost:8000/api/accounts/subscription/status/", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setSubscriptionInfo(data))
        .catch((err) => console.error("Error loading subscription:", err))
        .finally(() => setLoading(false));
    }, []);
  
    useEffect(() => {
      if (
        !subscriptionInfo ||
        !subscriptionInfo.renewal_date ||
        subscriptionInfo.plan?.toLowerCase() === "free"
      ) return;
  
      const now = new Date();
      const renewal = new Date(subscriptionInfo.renewal_date);
  
      if (
        subscriptionInfo.status === "active" &&
        renewal < now &&
        !subscriptionInfo.auto_renewal
      ) {
        fetch("http://localhost:8000/api/accounts/force-downgrade/", {
          method: "POST",
          credentials: "include",
        }).then(() => window.location.reload());
      }
    }, [subscriptionInfo]);
  
    const handleCancelSubscription = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/accounts/cancel-subscription/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
          },
        });
  
        const data = await res.json();
        if (res.ok) {
          setMessage(data.detail || "Subscription cancelled.");
          setSubscriptionInfo((prev) => ({
            ...prev,
            cancel_at_period_end: true,
          }));
        } else {
          setMessage(data.detail || "Failed to cancel subscription.");
        }
      } catch (err) {
        setMessage("Error cancelling subscription.");
      }
    };
  
    const handleAutoRenewToggle = async () => {
        try {
          // First check if card exists
          const cardRes = await fetch("http://localhost:8000/api/accounts/billing/status/", {
            credentials: "include",
          });
          const cardData = await cardRes.json();
      
          if (!cardData.has_credit_card) {
            alert("⚠️ You need to add a credit card before enabling auto-renewal.");
            setActiveTab("Billing"); // redirect to billing tab
            return;
          }
      
          // Fetch CSRF
          const csrfRes = await fetch("http://localhost:8000/api/accounts/csrf/", {
            credentials: "include",
          });
          const csrfData = await csrfRes.json();
      
          const res = await fetch("http://localhost:8000/api/accounts/subscription/toggle-auto-renew/", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfData.csrfToken,
            },
          });
      
          const data = await res.json();
          if (res.ok) {
            setSubscriptionInfo((prev) => ({
              ...prev,
              auto_renewal: data.auto_renewal,
              cancel_at_period_end: !data.auto_renewal,
            }));
            setMessage(data.message || "Auto-renewal status updated.");
          } else {
            setMessage(data.error || "Unable to update auto-renew.");
          }
        } catch (err) {
          console.error("Auto-renew toggle error:", err);
          setMessage("An error occurred while toggling auto-renew.");
        }
      };
      
  
    if (loading) return <div className="text-center">Loading subscription info...</div>;
    if (!subscriptionInfo) return <div className="text-center">No subscription data available.</div>;
  
    const isFree = (subscriptionInfo.plan || "").toLowerCase() === "free";
  
    return (
      <div>
        <h3>Subscription Management</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Current Plan: {subscriptionInfo.plan || "N/A"}</h5>
            <p><strong>Status:</strong> {subscriptionInfo.status}</p>
            <p><strong>Renewal Date:</strong> {subscriptionInfo.renewal_date ? new Date(subscriptionInfo.renewal_date).toLocaleDateString() : "N/A"}</p>
  
            {!isFree && subscriptionInfo.cancel_at_period_end && (
              <>
                <div className="alert alert-warning">
                  ⏳ Subscription will cancel at period end ({new Date(subscriptionInfo.renewal_date).toLocaleDateString()}).
                </div>
                <div className="alert alert-danger">
                  🚨 You will lose access to premium features after this date unless you renew.
                </div>
              </>
            )}
  
            {!isFree && !subscriptionInfo.cancel_at_period_end &&  (
              <div className={`alert mt-3 ${subscriptionInfo.auto_renewal ? "alert-success" : "alert-warning"}`}>
                {subscriptionInfo.auto_renewal
                  ? "🌟 Your subscription is set to auto-renew!"
                  : "⚠️ Auto-renewal is not enabled. Enable it for continuous service."}
              </div>
            )}
  
            <div className="mt-4">
              {!isFree ? (
                subscriptionInfo.cancel_at_period_end ? (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/payment', { state: { plan: accountType } })}
                  >
                    Renew Now
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-warning me-2"
                      onClick={handleAutoRenewToggle}
                    >
                      {subscriptionInfo.auto_renewal ? "Disable Auto-Renew" : "Enable Auto-Renew"}
                    </button>
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => setActiveTab("Billing")}
                    >
                      Update Payment Method
                    </button>
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={handleCancelSubscription}
                      disabled={subscriptionInfo.cancel_at_period_end}
                    >
                      Cancel Subscription
                    </button>
                  </>
                )
              ) : (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => navigate('/payment', { state: { plan: accountType } })}
                >
                  Pay Subscription
                </button>
              )}
            </div>
  
            {message && (
              <div className="alert alert-info mt-4">{message}</div>
            )}
          </div>
        </div>
      </div>
    );
  };  
  
  
  const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const validatePassword = (password) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      return regex.test(password);
    };
  
    const handlePasswordChange = async (e) => {
      e.preventDefault();
      setMessage('');
      setError('');
  
      if (formData.new_password !== formData.confirm_password) {
        setError('New passwords do not match.');
        return;
      }
  
      if (!validatePassword(formData.new_password)) {
        setError(
          'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
        );
        return;
      }
  
      try {
        const csrfRes = await fetch(
          'http://localhost:8000/api/accounts/csrf/',
          { credentials: 'include' }
        );
  
        const csrfData = await csrfRes.json();
        const csrfToken = csrfData.csrfToken;
  
        const res = await fetch(
          'http://localhost:8000/api/accounts/change-password/',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(formData),
          }
        );
  
        const data = await res.json();
  
        if (res.ok) {
          setMessage(data.message || 'Password changed successfully.');
          setFormData({
            current_password: '',
            new_password: '',
            confirm_password: '',
          });
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          const errors = Object.values(data).flat().join(' ');
          setError(errors || 'Failed to update password.');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        console.error(err);
      }
    };
  
    return (
      <div>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange} className="w-50">
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="current_password"
              className="form-control"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="new_password"
              className="form-control"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
  
        {message && <div className="alert alert-success mt-4">{message}</div>}
        {error && <div className="alert alert-danger mt-4">{error}</div>}
      </div>
    );
  };
  
const TwoFATab = () => {
  const [enabled, setEnabled] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch 2FA status and CSRF
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setEnabled(data.has_2fa || data.is_2fa_enabled); // backend should include this
      });

    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);

  const fetchQR = () => {
    fetch('http://localhost:8000/api/accounts/setup_2fa/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setQrData(data));
  };

  const handleEnable = () => {
    fetch('http://localhost:8000/api/accounts/enable_2fa/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage('✅ 2FA enabled successfully.');
          setEnabled(true);
          setQrData(null);
          setToken('');
        } else {
          setMessage('❌ Invalid token.');
        }
      });
  };

  const handleDisable = () => {
    fetch('http://localhost:8000/api/accounts/disable-2fa/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setEnabled(false);
          setQrData(null);
          setToken('');
          setMessage('🔕 2FA has been disabled.');
        }
      });
  };

  return (
    <div className="text-center">
      <h3 className="mb-4">Two-Factor Authentication (2FA)</h3>

      {message && <div className="alert alert-info">{message}</div>}

      {enabled ? (
        <div>
          <p>🔐 2FA is currently <strong>enabled</strong> on your account.</p>
          <button className="btn btn-danger" onClick={handleDisable}>Disable 2FA</button>
        </div>
      ) : qrData ? (
        <div>
          <p>📱 Scan this QR code with Google or Microsoft Authenticator:</p>
          <img src={`data:image/png;base64,${qrData.qr_code}`} alt="QR Code" style={{ width: 200, marginBottom: 10 }} />
          <p><strong>Manual Code:</strong> {qrData.secret}</p>
          <input
            type="text"
            className="form-control my-3"
            placeholder="Enter code from app"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleEnable}>Verify & Enable</button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={fetchQR}>Setup 2FA</button>
      )}
    </div>
  );
};

export default SettingAccountPage;