"use client";

import { useState, useMemo } from "react";

export default function BidTracker() {
  const [bids, setBids] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [form, setForm] = useState({
    project: "",
    trade: "",
    company: "",
    amount: "",
    notes: "",
    status: "Bidding"
  });

  const handleAddBid = () => {
    if (!form.project || !form.trade || !form.company || !form.amount) return;
    setBids([...bids, { ...form, id: Date.now() }]);
    setForm({ project: "", trade: "", company: "", amount: "", notes: "", status: "Bidding" });
  };

  const projects = [...new Set(bids.map(b => b.project))];

  const filteredBids = useMemo(() => {
    return selectedProject ? bids.filter(b => b.project === selectedProject) : bids;
  }, [bids, selectedProject]);

  const groupedByTrade = useMemo(() => {
    const groups = {};
    filteredBids.forEach(bid => {
      if (!groups[bid.trade]) groups[bid.trade] = [];
      groups[bid.trade].push(bid);
    });

    Object.keys(groups).forEach(trade => {
      groups[trade].sort((a, b) => Number(a.amount) - Number(b.amount));
    });

    return groups;
  }, [filteredBids]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "auto", fontFamily: "Arial" }}>
      <h1>Preconstruction Bid Leveling Tool</h1>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
        <input placeholder="Trade" value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} />
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Bidding</option>
          <option>Submitted</option>
          <option>Awarded</option>
          <option>Lost</option>
        </select>

        <button onClick={handleAddBid}>Add Bid</button>
      </div>

      <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="">All Projects</option>
        {projects.map((proj, idx) => (
          <option key={idx}>{proj}</option>
        ))}
      </select>

      {Object.keys(groupedByTrade).map((trade) => (
        <div key={trade} style={{ marginTop: 20 }}>
          <h2>{trade}</h2>

          <table border="1" cellPadding="5" width="100%">
            <thead>
              <tr>
                <th>Company</th>
                <th>Amount</th>
                <th>Delta</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {groupedByTrade[trade].map((bid, index) => {
                const low = Number(groupedByTrade[trade][0].amount);
                const delta = Number(bid.amount) - low;

                return (
                  <tr key={bid.id} style={{ background: index === 0 ? "#d4edda" : "white" }}>
                    <td>{bid.company}</td>
                    <td>${Number(bid.amount).toLocaleString()}</td>
                    <td>{delta === 0 ? "Low Bid" : `$${delta.toLocaleString()}`}</td>
                    <td>{bid.status}</td>
                    <td>{bid.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}