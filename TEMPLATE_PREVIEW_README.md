# Template Preview Feature

## Overview

The Template Preview feature allows users to view how each template will look with sample content before making their selection. This helps users make informed decisions about their portfolio design.

## How It Works

### 1. **Template Selection in Dashboard**
- Users navigate to the **Appearance** panel in their dashboard
- Three template options are displayed: Basic, Axis, and Eclipse
- Each template card shows a placeholder image and description

### 2. **Preview Links**
- Each template card has a **"Preview Template"** button
- Clicking this button opens the template in a new tab with mock data
- The preview shows exactly how the template will look with real content

### 3. **Mock Data**
- All templates use the same comprehensive mock profile data
- Includes realistic projects, skills, education, experience, and more
- Shows the full potential of each template

## Implementation Details

### **Files Created/Modified**

#### **New Files:**
- `src/lib/mockData.ts` - Comprehensive mock profile data
- `src/app/preview/[template]/page.tsx` - Preview page component
- `src/app/preview/layout.tsx` - Preview layout wrapper

#### **Modified Files:**
- `src/app/dashboard/components/AppearancePanel.tsx` - Added preview links

### **Preview URLs**
- **Basic Template**: `/preview/basic`
- **Axis Template**: `/preview/axis`
- **Eclipse Template**: `/preview/eclipse`

### **Mock Data Structure**
The mock profile includes:
- **Personal Info**: Name, headline, bio, avatar
- **Skills**: Frontend, Backend, and DevOps skills with percentages
- **Projects**: 3 detailed projects with images and descriptions
- **Education**: University degrees and achievements
- **Experience**: Work history with technologies used
- **Services**: Professional services offered
- **Social Links**: LinkedIn, GitHub, Twitter
- **Additional Info**: Location, availability, certifications

## User Experience

### **Dashboard View**
1. User sees three template options
2. Each template has a "Preview Template" button
3. Helpful tip explains how to use the preview feature

### **Preview Experience**
1. Click "Preview Template" opens new tab
2. Template renders with realistic mock data
3. User can see full template functionality
4. Easy to compare different templates

### **Template Selection**
1. User previews templates they're interested in
2. Makes informed decision based on actual appearance
3. Selects template in dashboard
4. Template is applied to their portfolio

## Technical Features

### **Responsive Design**
- All preview templates are fully responsive
- Shows how templates look on different screen sizes
- Mobile and desktop views are properly represented

### **Interactive Elements**
- Project modals and animations work in preview
- All template features are functional
- Users can test navigation and interactions

### **Performance**
- Preview pages are lightweight
- No database queries for preview data
- Fast loading for better user experience

## Benefits

### **For Users**
- **Informed Decisions**: See exactly what they're getting
- **Better Experience**: No surprises after template selection
- **Confidence**: Know their choice is right for their needs

### **For Platform**
- **Reduced Support**: Fewer questions about template differences
- **Higher Satisfaction**: Users get what they expect
- **Better Conversion**: Users more likely to upgrade to paid plans

## Future Enhancements

### **Potential Improvements**
1. **Custom Mock Data**: Allow users to input their own preview data
2. **Side-by-Side Comparison**: View multiple templates simultaneously
3. **Mobile Preview Toggle**: Switch between desktop and mobile views
4. **Template Ratings**: Let users rate templates after previewing
5. **Favorite Templates**: Save preferred templates for later reference

## Usage Instructions

### **For Developers**
1. Mock data is in `src/lib/mockData.ts`
2. Preview routes are in `src/app/preview/[template]/`
3. Template components are imported from existing template files
4. No changes needed to existing template code

### **For Users**
1. Go to Dashboard → Appearance
2. Click "Preview Template" on any template
3. View template in new tab with sample content
4. Return to dashboard and select preferred template
5. Save changes to apply template

## Troubleshooting

### **Common Issues**
- **Preview not opening**: Check if popup blockers are enabled
- **Template not loading**: Ensure all template components are properly imported
- **Mock data missing**: Verify `mockData.ts` file exists and is exported

### **Debug Steps**
1. Check browser console for errors
2. Verify preview routes are accessible
3. Confirm template components render correctly
4. Test with different browsers/devices
