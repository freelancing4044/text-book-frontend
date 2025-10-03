import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Profile = ({url}) => {
  const { token } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('You must be logged in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${url}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data.user);
        setResults(response.data.data.results);
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token, url]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='profile'>
      {user && (
        <div className='profile-info'>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
      <div className='profile-results'>
        <h3>Your Test Results</h3>
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td>{result.test.title}</td>
                  <td>{result.test.subject}</td>
                  <td>{result.score}/{result.totalQuestions}</td>
                  <td>{result.percentage.toFixed(2)}%</td>
                  <td>{new Date(result.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have not taken any tests yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
