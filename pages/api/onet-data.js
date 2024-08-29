import { fetchSkills, getOccupationDetails, searchOccupations } from '../../src/utils/api';
import { calculateAPO } from '../../src/utils/apo';

export default async function handler(req, res) {
  const { occupation } = req.query;
  try {
    const response = await api.get(`mnm/careers/${occupation}`);
    const apo = calculateAPO(response.data);
    res.status(200).json({ ...response.data, apo });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching O*NET data' });
  }
}