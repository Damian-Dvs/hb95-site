import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PRESET_AMOUNTS = [5, 10, 20, 50];

const PayPalSection = ({ amount }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  if (success) {
    return (
      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-5 text-teal-800 text-sm font-semibold text-center">
        Thank you so much! Your donation of £{amount} means a lot to Harley. 🏁
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <p className="text-red-500 text-xs text-center mb-3">{error}</p>
      )}
      {isPending && (
        <div className="text-center text-sm text-gray-400 mb-3">Loading PayPal…</div>
      )}
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'donate', height: 45 }}
        fundingSource="paypal"
        createOrder={(_data, actions) =>
          actions.order.create({
            purchase_units: [{
              amount: { value: amount.toFixed(2), currency_code: 'GBP' },
              description: 'HB95 Racing — Donation',
            }],
          })
        }
        onApprove={async (_data, actions) => {
          await actions.order.capture();
          setSuccess(true);
          setError('');
        }}
        onError={() => setError('Something went wrong with PayPal. Please try again.')}
        onCancel={() => setError('')}
      />
    </div>
  );
};

const Donate = () => {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom]     = useState('');

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const amount   = selected ?? (parseFloat(custom) || null);

  if (!clientId) {
    return (
      <section id="donate" className="bg-white py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Support the Journey</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Donate</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4 mb-8" />
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-sm text-gray-400">
            Donations Opening Soon
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="donate" className="bg-white py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Support the Journey</p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Donate</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4 mb-8" />
        <p className="text-gray-500 leading-relaxed mb-10 max-w-sm mx-auto">
          Karting is an incredible sport — but also an expensive one. Every contribution helps Harley get closer to the podium.
        </p>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Choose an amount</p>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {PRESET_AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => { setSelected(a); setCustom(''); }}
                className={`rounded-xl py-4 text-center font-bold text-lg border-2 transition-all duration-300
                  ${selected === a
                    ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-teal-400 hover:shadow-sm'}`}
              >
                £{a}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 font-semibold text-sm pl-1">£</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Custom amount"
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(null); }}
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-teal-400 focus:outline-none transition-colors"
            />
          </div>

          {amount && amount >= 1 ? (
            <PayPalSection key={amount} amount={amount} />
          ) : (
            <p className="text-xs text-gray-400 mt-4">Select or enter an amount above to donate via PayPal</p>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-5">
          Payments are processed securely by PayPal. Thank you for your support!
        </p>
      </div>
    </section>
  );
};

export default Donate;
