// Quick test to verify knowledge base data

(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/knowledge');
    const data = await response.json();

    console.log('\n✅ KNOWLEDGE BASE DATA FETCHED\n');
    console.log('📦 Profile:', data.profile?.name, '-', data.profile?.title);
    console.log('📊 Experience entries:', data.experience?.length || 0);
    console.log('🎓 Education entries:', data.education?.length || 0);
    console.log('💼 Skills:', data.skills?.length || 0);
    console.log('🛠️ Projects:', data.projects?.length || 0);

    if (data.skills && data.skills.length > 0) {
      console.log('\n📚 Sample Skills (first 5):');
      data.skills.slice(0, 5).forEach(s => {
        console.log(`  • ${s.name}${s.endorsements ? ` (${s.endorsements} endorsements)` : ''}`);
      });
      console.log(`  ... and ${Math.max(0, data.skills.length - 5)} more skills`);
    }

    if (data.projects && data.projects.length > 0) {
      console.log('\n🛠️ Sample Projects (first 3):');
      data.projects.slice(0, 3).forEach(p => {
        console.log(`  • ${p.name}${p.languages ? ` [${p.languages.join(', ')}]` : ''}`);
      });
      console.log(`  ... and ${Math.max(0, data.projects.length - 3)} more projects`);
    }

    if (data.education && data.education.length > 0) {
      console.log('\n🎓 Education:');
      data.education.forEach(e => {
        console.log(`  • ${e.degree} in ${e.field} from ${e.school}`);
      });
    }

    if (data.experience && data.experience.length > 0) {
      console.log('\n💼 Experience:');
      data.experience.forEach(e => {
        console.log(`  • ${e.title} at ${e.company}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
