import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { Copy, Download, Code, FileText, Folder } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface SourceCodeViewerProps {
  testId?: string;
}

export function SourceCodeViewer({ testId }: SourceCodeViewerProps) {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['app', 'components', 'hooks', 'constants']));

  // File structure based on the provided file list
  const fileStructure: FileNode[] = [
    {
      name: 'app',
      path: 'app',
      type: 'folder',
      children: [
        {
          name: '(tabs)',
          path: 'app/(tabs)',
          type: 'folder',
          children: [
            { name: '_layout.tsx', path: 'app/(tabs)/_layout.tsx', type: 'file' },
            { name: 'index.tsx', path: 'app/(tabs)/index.tsx', type: 'file' },
            { name: 'habits.tsx', path: 'app/(tabs)/habits.tsx', type: 'file' },
            { name: 'meals.tsx', path: 'app/(tabs)/meals.tsx', type: 'file' },
            { name: 'supplements.tsx', path: 'app/(tabs)/supplements.tsx', type: 'file' },
            { name: 'addictions.tsx', path: 'app/(tabs)/addictions.tsx', type: 'file' },
            { name: 'settings.tsx', path: 'app/(tabs)/settings.tsx', type: 'file' }
          ]
        },
        {
          name: 'auth',
          path: 'app/auth',
          type: 'folder',
          children: [
            { name: 'index.tsx', path: 'app/auth/index.tsx', type: 'file' }
          ]
        },
        { name: '_layout.tsx', path: 'app/_layout.tsx', type: 'file' },
        { name: 'modal.tsx', path: 'app/modal.tsx', type: 'file' },
        { name: '+not-found.tsx', path: 'app/+not-found.tsx', type: 'file' }
      ]
    },
    {
      name: 'components',
      path: 'components',
      type: 'folder',
      children: [
        {
          name: 'ui',
          path: 'components/ui',
          type: 'folder',
          children: [
            { name: 'StatusBar.tsx', path: 'components/ui/StatusBar.tsx', type: 'file' },
            { name: 'Card.tsx', path: 'components/ui/Card.tsx', type: 'file' },
            { name: 'Button.tsx', path: 'components/ui/Button.tsx', type: 'file' },
            { name: 'IconButton.tsx', path: 'components/ui/IconButton.tsx', type: 'file' },
            { name: 'Input.tsx', path: 'components/ui/Input.tsx', type: 'file' },
            { name: 'SourceCodeViewer.tsx', path: 'components/ui/SourceCodeViewer.tsx', type: 'file' }
          ]
        },
        {
          name: 'habits',
          path: 'components/habits',
          type: 'folder',
          children: [
            { name: 'HabitItem.tsx', path: 'components/habits/HabitItem.tsx', type: 'file' }
          ]
        },
        {
          name: 'meals',
          path: 'components/meals',
          type: 'folder',
          children: [
            { name: 'MealItem.tsx', path: 'components/meals/MealItem.tsx', type: 'file' }
          ]
        },
        {
          name: 'supplements',
          path: 'components/supplements',
          type: 'folder',
          children: [
            { name: 'SupplementItem.tsx', path: 'components/supplements/SupplementItem.tsx', type: 'file' }
          ]
        },
        {
          name: 'addictions',
          path: 'components/addictions',
          type: 'folder',
          children: [
            { name: 'AddictionItem.tsx', path: 'components/addictions/AddictionItem.tsx', type: 'file' }
          ]
        },
        {
          name: 'dashboard',
          path: 'components/dashboard',
          type: 'folder',
          children: [
            { name: 'StatsCard.tsx', path: 'components/dashboard/StatsCard.tsx', type: 'file' },
            { name: 'ScheduleItem.tsx', path: 'components/dashboard/ScheduleItem.tsx', type: 'file' }
          ]
        },
        {
          name: 'ai',
          path: 'components/ai',
          type: 'folder',
          children: [
            { name: 'GlobalAICoach.tsx', path: 'components/ai/GlobalAICoach.tsx', type: 'file' },
            { name: 'ReminderManager.tsx', path: 'components/ai/ReminderManager.tsx', type: 'file' }
          ]
        }
      ]
    },
    {
      name: 'hooks',
      path: 'hooks',
      type: 'folder',
      children: [
        { name: 'useAuth.tsx', path: 'hooks/useAuth.tsx', type: 'file' },
        { name: 'useTheme.tsx', path: 'hooks/useTheme.tsx', type: 'file' },
        { name: 'useAudio.tsx', path: 'hooks/useAudio.tsx', type: 'file' },
        { name: 'useData.tsx', path: 'hooks/useData.tsx', type: 'file' },
        { name: 'useAICoach.tsx', path: 'hooks/useAICoach.tsx', type: 'file' },
        { name: 'useAddictions.tsx', path: 'hooks/useAddictions.tsx', type: 'file' }
      ]
    },
    {
      name: 'constants',
      path: 'constants',
      type: 'folder',
      children: [
        { name: 'colors.ts', path: 'constants/colors.ts', type: 'file' },
        { name: 'themes.ts', path: 'constants/themes.ts', type: 'file' },
        { name: 'mockData.ts', path: 'constants/mockData.ts', type: 'file' }
      ]
    },
    { name: 'types/index.ts', path: 'types/index.ts', type: 'file' },
    { name: 'app.json', path: 'app.json', type: 'file' },
    { name: 'package.json', path: 'package.json', type: 'file' },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' }
  ];

  const loadFileContent = async (filePath: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll show the file structure and some sample content
      // In a real implementation, you would read the actual file content
      const sampleContent = getSampleFileContent(filePath);
      setFileContent(sampleContent);
    } catch {
      setFileContent(`// Error loading file: ${filePath}\n// File not accessible`);
    } finally {
      setLoading(false);
    }
  };

  const getSampleFileContent = (filePath: string): string => {
    // Return sample content based on file type and path
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      return `// ${filePath}
// This is a TypeScript/React Native file

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  // Component props would be defined here
}

export default function Component({ }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Sample component content
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  text: {
    fontSize: 16
  }
});

// This is a sample representation of the actual file content.
// In a production app, you would read the real file contents.`;
    } else if (filePath.endsWith('.json')) {
      return `{
  "name": "rork-app",
  "version": "1.0.0",
  "description": "A React Native health and wellness app",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~53.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "@expo/vector-icons": "^14.0.4",
    "lucide-react-native": "^0.468.0"
  }
}`;
    } else {
      return `// ${filePath}
// File content would be displayed here
// This is a sample representation of the source code

// The app is fully open source and all code can be viewed and modified
// after creation. This includes:
// - React Native components
// - TypeScript hooks and utilities  
// - Styling and themes
// - Configuration files
// - Package dependencies

// You can copy any part of this code and use it in your own projects.`;
    }
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await Clipboard.setString(content);
      Alert.alert('Copied', 'Content copied to clipboard!');
    } catch {
      Alert.alert('Error', 'Failed to copy content');
    }
  };

  const downloadAllSource = () => {
    Alert.alert(
      'Download Source Code',
      'This app is completely open source! All the code you see here can be copied, modified, and used in your own projects. The source includes:\n\n• React Native components\n• TypeScript hooks and utilities\n• Styling and theme system\n• AI integration code\n• Configuration files\n\nFeel free to use any part of this codebase for your own applications.',
      [
        { text: 'Got it!', style: 'default' }
      ]
    );
  };

  const renderFileTree = (nodes: FileNode[], depth: number = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const isSelected = selectedFile === node.path;
      
      return (
        <View key={node.path}>
          <TouchableOpacity
            style={[
              styles.fileItem,
              {
                paddingLeft: 16 + depth * 20,
                backgroundColor: isSelected ? `${theme.primary}20` : 'transparent'
              }
            ]}
            onPress={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                setSelectedFile(node.path);
                loadFileContent(node.path);
              }
            }}
          >
            <View style={styles.fileItemContent}>
              {node.type === 'folder' ? (
                <Folder 
                  size={16} 
                  color={isExpanded ? theme.primary : theme.textSecondary} 
                />
              ) : (
                <FileText size={16} color={theme.textSecondary} />
              )}
              <Text 
                style={[
                  styles.fileName,
                  { 
                    color: isSelected ? theme.primary : theme.text,
                    fontWeight: isSelected ? '600' : '400'
                  }
                ]}
              >
                {node.name}
              </Text>
            </View>
          </TouchableOpacity>
          
          {node.type === 'folder' && isExpanded && node.children && (
            renderFileTree(node.children, depth + 1)
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container} testID={testId}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Code size={24} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Source Code</Text>
        </View>
        <Button
          title="Download All"
          onPress={downloadAllSource}
          icon={<Download size={16} color="white" />}
          style={styles.downloadButton}
        />
      </View>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        🎉 This app is completely open source! Browse the file structure below and copy any code you need. All components, hooks, and utilities are available for you to use in your own projects.
      </Text>
      
      <View style={styles.content}>
        {/* File Tree */}
        <View style={[styles.fileTree, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Files</Text>
          <ScrollView style={styles.fileTreeScroll}>
            {renderFileTree(fileStructure)}
          </ScrollView>
        </View>
        
        {/* File Content */}
        <View style={[styles.fileContent, { borderColor: theme.border }]}>
          {selectedFile ? (
            <>
              <View style={styles.fileHeader}>
                <Text style={[styles.fileTitle, { color: theme.text }]}>
                  {selectedFile}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(fileContent)}
                  style={styles.copyButton}
                >
                  <Copy size={16} color={theme.primary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.codeScroll}>
                <Text style={[styles.codeText, { color: theme.text }]}>
                  {loading ? 'Loading...' : fileContent}
                </Text>
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <FileText size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Select a file to view its content
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  downloadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 16
  },
  fileTree: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  fileTreeScroll: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  fileItem: {
    paddingVertical: 8,
    paddingRight: 12
  },
  fileItemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fileName: {
    fontSize: 14,
    marginLeft: 8
  },
  fileContent: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  fileTitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  copyButton: {
    padding: 4
  },
  codeScroll: {
    flex: 1
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    padding: 12,
    lineHeight: 18
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center'
  }
});