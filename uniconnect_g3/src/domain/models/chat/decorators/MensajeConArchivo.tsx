import React from 'react';
import { ReactNode } from 'react';
import { View, Text, Pressable, ActivityIndicator, Platform } from 'react-native';
import { MensajeDecorator } from '../MensajeDecorator';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';

export class MensajeConArchivo extends MensajeDecorator {
  constructor(
    mensaje: any,
    private fileUrl: string,
    private fileName: string,
    private fileSize?: number
  ) {
    super(mensaje);
  }

  getMetadata(): any {
    return {
      ...super.getMetadata(),
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      fileSize: this.fileSize,
    };
  }

  private handleDownload = async () => {
    if (!this.fileUrl) return;

    if (Platform.OS === 'web') {
      window.open(this.fileUrl, '_blank');
      return;
    }

    try {
      const encodedUrl = encodeURI(this.fileUrl);
      const cleanFileName = this.fileName ? this.fileName.replace(/\s/g, '_') : `file_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${cleanFileName}`;

      const downloadResult = await FileSystem.downloadAsync(encodedUrl, fileUri);

      if (downloadResult.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        }
      }
    } catch (error) {
      console.error("Error en download:", error);
    }
  };

  render(): ReactNode {
    const isOwn = this.getMetadata().isOwn;
    
    const formatSize = (bytes?: number) => {
      if (!bytes) return '';
      if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / 1024).toFixed(0)} KB`;
    };

    const getFileIcon = (name?: string) => {
      const n = name?.toLowerCase() || '';
      if (n.endsWith('.pdf')) return '📕';
      if (n.endsWith('.doc') || n.endsWith('.docx')) return '📘';
      if (n.endsWith('.xls') || n.endsWith('.xlsx')) return '📗';
      if (n.endsWith('.ppt') || n.endsWith('.pptx')) return '📙';
      if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg')) return '🖼️';
      return '📄';
    };

    return (
      <View>
        {super.render()}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>{getFileIcon(this.fileName)}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: isOwn ? '#fff' : '#000', fontWeight: 'bold', fontSize: 12 }} numberOfLines={1}>
                {this.fileName}
              </Text>
              <Text style={{ color: isOwn ? '#e0e7ff' : '#6b7280', fontSize: 10 }}>
                {formatSize(this.fileSize)}
              </Text>
            </View>
          </View>
          <Pressable 
            onPress={this.handleDownload}
            style={{ 
              marginTop: 8, 
              backgroundColor: isOwn ? '#fff' : '#4f46e5', 
              padding: 6, 
              borderRadius: 4,
              alignItems: 'center' 
            }}
          >
            <Text style={{ color: isOwn ? '#4f46e5' : '#fff', fontWeight: 'bold', fontSize: 11 }}>
              {Platform.OS === 'web' ? 'Descargar' : 'Abrir'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
