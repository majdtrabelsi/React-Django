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
        return <SubscriptionManagement accountType={accountType} />;
      case 'ChangePassword':
        return <ChangePassword />;
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
                {['dashboard', 'Billing', 'BillingHistory', 'Subscription', 'ChangePassword'].map((tab) => (
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


// === DASHBOARD ===
const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/billing/status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCardInfo(data))
      .catch(() => setCardInfo(null));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/subscription/status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setSubscriptionInfo(data))
      .catch(() => setSubscriptionInfo(null));
  }, []);

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

  if (loading) {
    return <div className="text-center my-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!accountData) {
    return <div className="text-center my-5">No account data available.</div>;
  }


  const {
    username,
    last_login,
    date_joined,
    account_type,
    subscription_due,
    first_name,
    last_name,
  } = accountData;

  const joinedDate = new Date(date_joined);
  const accountAgeInYears = (new Date() - joinedDate) / (1000 * 60 * 60 * 24 * 365);
  const isOlder = accountAgeInYears > 1;

  const isPremium = ['professional', 'company'].includes(account_type);
  const accountAgeInDays = Math.floor((new Date() - joinedDate) / (1000 * 60 * 60 * 24));
  let loyaltyMessage = null;
  if (accountAgeInDays >= 365) {
    loyaltyMessage = "🎉 You've been with us for over a year — we appreciate your loyalty!";
  } else if (accountAgeInDays >= 180) {
    loyaltyMessage = "🥳 6 months already? You're amazing!";
  } else if (accountAgeInDays >= 90) {
    loyaltyMessage = "🔥 3 months strong! Thanks for sticking around!";
  } else if (accountAgeInDays >= 30) {
    loyaltyMessage = "🎈 1 month milestone — thanks for being here!";
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mb-3 shadow-sm">
          <div className="card-body text-center">
            <h4 className="card-title mb-3">👤 Welcome, {first_name +' '+ last_name}</h4>
            <p><strong>Registration Email :</strong> {username}</p>
            <p><strong>Last Visit:</strong> {new Date(last_login).toLocaleDateString()}</p>
            <p><strong>Account Type:</strong> {account_type.charAt(0).toUpperCase() + account_type.slice(1)}</p>
            <p><strong>Joined:</strong> {joinedDate.toLocaleDateString()}</p>
            {loyaltyMessage && (
                <div className="alert alert-success mt-3">
                    {loyaltyMessage}
                </div>
            )}

            {subscriptionInfo && !subscriptionInfo.plan=='Free' && (
              <p><strong>Subscription ends on:</strong> {new Date(subscriptionInfo.renewal_date).toLocaleDateString()}</p>
            )}
            {subscriptionInfo && subscriptionInfo.plan=='Free' && (
              <p><strong>Subscription ends on :</strong><span style={{ color: `red` }}> No Active Subscription</span> </p>
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

            {isOlder && (
              <div className="alert alert-success mt-3">
                � You've been with us for over a year!
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
const SubscriptionManagement = ({ accountType }) => {
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [account_type, setAccountType] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch('http://localhost:8000/api/accounts/accountdatas/', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => setAccountType(data.account_type))
        .catch((err) => console.error("Error fetching account data:", err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8000/api/accounts/subscription/status/', {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Subscription data:", data);
            setSubscriptionInfo(data);
          })
          .catch((error) => {
            console.error("Error fetching subscription data:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);
      
    useEffect(() => {
        if (
          !subscriptionInfo ||
          !subscriptionInfo.renewal_date ||
          subscriptionInfo.plan?.toLowerCase() === 'free'
        ) return;
      
        const now = new Date();
        const renewal = new Date(subscriptionInfo.renewal_date);
      
        if (
          subscriptionInfo.status === 'active' &&
          renewal < now &&
          !subscriptionInfo.auto_renewal
        ) {
          fetch("http://localhost:8000/api/accounts/force-downgrade/", {
            method: "POST",
            credentials: "include",
          }).then(() => window.location.reload());
        }
      }, [subscriptionInfo]);
      
      
  
      const handleAutoRenewToggle = async () => {
        try {
          const csrfRes = await fetch("http://localhost:8000/api/accounts/csrf/", {
            credentials: "include",
          });
          const csrfData = await csrfRes.json();
          const csrfToken = csrfData.csrfToken;
      
          
          const res = await fetch("http://localhost:8000/api/accounts/subscription/toggle-auto-renew/", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
          });
      
          const data = await res.json();
      
          if (res.ok) {
            alert(data.message || "Auto-renewal updated.");
            window.location.reload();
          } else {
            alert(data.error || "Unable to update auto-renew.");
          }
        } catch (err) {
          console.error("Auto-renew toggle error:", err);
          alert("An error occurred while toggling auto-renew.");
        }
      };
      
  
    if (loading) return <div className="text-center">Loading subscription info...</div>;
    if (!subscriptionInfo) return <div className="text-center">No subscription data available.</div>;
  
    const isFree = (subscriptionInfo.plan || '').toLowerCase() === 'free';
  
    return (
      <div>
        <h3>Subscription Management</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Current Plan: {subscriptionInfo.plan || 'N/A'}</h5>
            <p><strong>Status:</strong> {subscriptionInfo.status}</p>
            <p><strong>Renewal Date:</strong> {subscriptionInfo.renewal_date ? new Date(subscriptionInfo.renewal_date).toLocaleDateString() : 'N/A'}</p>
  
            {!isFree &&(subscriptionInfo.auto_renewal ? (
              <div className="alert alert-success mt-3">
                🌟 Your subscription is set to auto-renew!
              </div>
            ) : (
              <div className="alert alert-warning mt-3">
                ⚠️ Auto-renewal is not enabled. Please enable it for continuous service.
              </div>
            ))}
  
            <div className="mt-4">
              {!isFree ? (
                <>
                  <button
                    className="btn btn-outline-warning me-2"
                    onClick={handleAutoRenewToggle}
                    >
                    {subscriptionInfo.auto_renewal ? "Disable Auto-Renew" : "Enable Auto-Renew"}
                  </button>
                  <button className="btn btn-outline-primary me-2">Update Payment Method</button>
                  <button className="btn btn-outline-danger me-2">Cancel Subscription</button>

                </>
              ) : (
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => navigate('/payment', { state: { plan: account_type } })}
                >
                  Pay Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
// === CHANGE PASSWORD ===
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

const handlePasswordChange = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  if (formData.new_password !== formData.confirm_password) {
    setError('New passwords do not match.');
    return;
  }

  try {
    const csrfRes = await fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    });

    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;

    const res = await fetch("http://localhost:8000/api/accounts/change-password/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "Password changed successfully.");
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      const errors = Object.values(data).flat().join(" ");
      setError(errors || "Failed to update password.");
    }
  } catch (err) {
    setError("An error occurred. Please try again.");
    console.error(err);
  }
};

return (
  <div>
    <h3>Change Password</h3>
    <form onSubmit={handlePasswordChange} className="w-50">
      <div className="mb-3">
        <label className="form-label">Current Password</label>
        <input type="password" name="current_password" className="form-control" value={formData.current_password} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">New Password</label>
        <input type="password" name="new_password" className="form-control" value={formData.new_password} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Confirm New Password</label>
        <input type="password" name="confirm_password" className="form-control" value={formData.confirm_password} onChange={handleChange} required />
      </div>
      <button type="submit" className="btn btn-primary">Update Password</button>
    </form>

    {message && <div className="alert alert-success mt-4">{message}</div>}
    {error && <div className="alert alert-danger mt-4">{error}</div>}
  </div>
);
};

export default SettingAccountPage;