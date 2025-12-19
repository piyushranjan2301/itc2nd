
import { EngagementQuestion, BehavioralQuestion, SJTQuestion } from './types';

export const ENGAGEMENT_QUESTIONS: EngagementQuestion[] = [
  { id: 'e1', hindi: 'क्या आपको लगता है कि आपके काम का कोई उद्देश्य है?', english: 'Do you feel your work has a purpose?', dimension: 'Organizational Engagement' },
  { id: 'e2', hindi: 'क्या आप अपनी भूमिका और जिम्मेदारियों को स्पष्ट रूप से समझते हैं?', english: 'Do you clearly understand your role and responsibilities?', dimension: 'Job Engagement' },
  { id: 'e3', hindi: 'क्या आपका काम आपको ऊर्जावान बनाता है?', english: 'Does your work energize you?', dimension: 'Vigor' },
  { id: 'e4', hindi: 'क्या आप काम चुनौतीपूर्ण होने पर भी डटे रहते हैं?', english: 'Do you persist even when work is challenging?', dimension: 'Dedication' },
  { id: 'e5', hindi: 'क्या आपके पास अपना काम करने के लिए आवश्यक सभी उपकरण और संसाधन हैं?', english: 'Do you have all the tools and resources needed to do your job?', dimension: 'Organizational Support' },
  { id: 'e6', hindi: 'क्या आपको हाल ही में अच्छे काम के लिए सराहना मिली है?', english: 'Have you received recognition for good work recently?', dimension: 'Recognition' },
  { id: 'e7', hindi: 'क्या आपके टीम के सदस्य एक-दूसरे की मदद करते हैं?', english: 'Do your team members help one another?', dimension: 'Teamwork' },
  { id: 'e8', hindi: 'क्या आप प्रबंधन के निर्णयों को समझते हैं?', english: 'Do you understand management’s decisions?', dimension: 'Communication' },
  { id: 'e9', hindi: 'क्या आप नियमित रूप से नए विचार और सुझाव साझा करते हैं?', english: 'Do you share new ideas and suggestions regularly?', dimension: 'Innovation' },
  { id: 'e10', hindi: 'क्या आप कभी अपने काम में इतने व्यस्त हो जाते हैं कि आपको समय का पता ही नहीं चलता?', english: 'Do you ever get so involved in your work that you lose track of time?', dimension: 'Absorption' },
  { id: 'e11', hindi: 'क्या आपको लगता है कि आपका काम आपके जीवन में संतुलन लाता है?', english: 'Do you feel your work brings balance to your life?', dimension: 'Well-being' },
  { id: 'e12', hindi: 'क्या आपको समय पर सुरक्षा अपडेट और निर्देश मिलते हैं?', english: 'Do you receive timely safety updates and instructions?', dimension: 'Welfare/Environment' },
];

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  { 
    id: 'b1', 
    question: 'When under pressure at work, which is more likely true for you?', 
    optionA: { text: 'I tend to complete tasks faster, even if they are not perfect.', trait: 'Executor' },
    optionB: { text: 'I slow down to ensure every detail is correct.', trait: 'Guardian' }
  },
  { 
    id: 'b2', 
    question: 'If your coworker isn’t performing well, what would you most likely do?', 
    optionA: { text: 'Take on extra work myself without making a fuss.', trait: 'Harmonizer' },
    optionB: { text: 'Tell the supervisor so they can intervene.', trait: 'Informer' }
  },
  { 
    id: 'b3', 
    question: 'Which of these best matches your natural work style?', 
    optionA: { text: 'I prefer to strictly follow routines and rules.', trait: 'Guardian' },
    optionB: { text: 'I like to adapt and try new ways to do my tasks.', trait: 'Innovation' }
  },
  { 
    id: 'b4', 
    question: 'If you make a mistake during your shift, how do you usually react?', 
    optionA: { text: 'I quietly fix it and move on.', trait: 'Executor' },
    optionB: { text: 'I discuss it with the team to ensure it doesn’t happen again.', trait: 'Informer' }
  },
  { 
    id: 'b5', 
    question: 'What motivates you more at work?', 
    optionA: { text: 'Receiving praise from supervisors.', trait: 'Harmonizer' },
    optionB: { text: 'Knowing that my work helps the team succeed.', trait: 'Harmonizer' }
  }
];

export const SJT_QUESTIONS: SJTQuestion[] = [
  {
    id: 's1',
    scenario: 'You notice your colleague using outdated tools, which might affect quality. What would you do?',
    options: [
      { key: 'A', text: 'Inform the supervisor immediately to avoid defects.', alignment: 'High Initiative' },
      { key: 'B', text: 'Quietly give your own tools for the day and report later.', alignment: 'Balanced Adaptability' },
      { key: 'C', text: 'Wait and see if the quality actually suffers before acting.', alignment: 'Risk-Averse' },
      { key: 'D', text: 'Raise the issue in the next team meeting as a process improvement point.', alignment: 'Strategic' },
    ]
  },
  {
    id: 's2',
    scenario: 'Your manager forgets to inform your team about a sudden schedule change. Half your team misses the shift.',
    options: [
      { key: 'A', text: 'Tell the team individually about future alerts.', alignment: 'Teamwork' },
      { key: 'B', text: 'Raise it in the next feedback session with the manager.', alignment: 'Communicative' },
      { key: 'C', text: 'Escalate to HR and demand accountability.', alignment: 'Risk-Averse' },
      { key: 'D', text: 'Remind the manager to create a WhatsApp group for timely updates.', alignment: 'Strategic' },
    ]
  }
];
