import  { useEffect, useState } from 'react';
import styles from './CheckboxGroup.module.css';

const CheckboxGroup = ({ selectedItems,onSelectionChange }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    setCheckedItems(selectedItems);
  }, [selectedItems]);

  const items = [
    "Compassionate", "Empathetic", "Patient", "Detail-oriented", "Dependable",
    "Adaptable", "Strong work ethic", "Team player", "Good communicator", "Resilient",
    "Critical thinker", "Problem-solver", "Organized", "Punctual", "Motivated",
    "Culturally sensitive", "Good listener", "Open-minded", "Professional", "Honest",
    "Respectful", "Calm under pressure", "Dedicated", "Willing to learn", "Self-aware",
    "Self-directed", "Ethical", "Caring", "Confident", "Strong clinical skills",
    "Good bedside manner", "Able to multitask", "Reliable", "Good judgment", "Resourceful",
    "Emotionally intelligent", "Physically resilient", "Emotionally resilient", "Strong interpersonal skills",
    "Adaptable to technology", "Knowledgeable", "Energetic", "Enthusiastic", "Approachable",
    "Humility", "Curious", "Efficient", "Proactive", "Good time management",
    "Flexible", "Positive attitude", "Focused", "Attention to detail", "Strong leadership skills",
    "Collaborative", "Good writing skills", "Diplomatic", "Good sense of humor", "Courageous",
    "Strong decision-maker", "Practical", "Innovative", "Good problem prioritization", "Supportive",
    "Good teaching skills", "Analytical", "Good self-care practices", "Self-reflective", "Respects patient autonomy",
    "Good at delegation", "Ethically-minded", "Understands patient confidentiality", "Handles criticism well", "Persistent",
    "Loyal", "Mentor-oriented", "Good public speaking skills", "Compassion for coworkers", "Strong commitment to patient care",
    "Values teamwork", "Knowledgeable about latest research", "Nonjudgmental", "Works well under supervision", "Adheres to protocols",
    "Good self-discipline", "Clear communicator", "Good at building rapport", "Intellectually curious", "Accountable",
    "Takes initiative", "Handles conflict well", "Good organizational skills", "Detail-focused in documentation", "Proficient in medical procedures",
    "Good hand-eye coordination", "Emotionally stable", "Good at managing stress", "Good at prioritizing tasks", "Values continuous improvement",
    "Committed to lifelong learning"
  ];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const updatedCheckedItems = checked
      ? [...checkedItems, value]
      : checkedItems.filter(item => item !== value);
    setCheckedItems(updatedCheckedItems);
    onSelectionChange(updatedCheckedItems);
  };

  return (
    <div className={styles.checkboxGrid}>
      {items.map((item, index) => (
        <label key={index} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            value={item}
            checked={checkedItems.includes(item)}
            onChange={handleCheckboxChange}
          />
          {index+1}. {item}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
