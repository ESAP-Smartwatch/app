import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';

const LineChart = ({ data, color, height = 180, showDots = false, label }) => {
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width - 40;
  
  // Fixed point spacing - each data point takes 10 pixels
  const pointSpacing = 10;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 10;
  const paddingBottom = 30;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Calculate total width based on number of data points
  const minDataPoints = Math.floor((screenWidth - paddingLeft - paddingRight) / pointSpacing);
  const dataPointsToShow = Math.max(data.length, minDataPoints);
  const chartWidth = dataPointsToShow * pointSpacing;
  const totalWidth = chartWidth + paddingLeft + paddingRight;

  // Auto-scroll to the end when data updates
  useEffect(() => {
    if (scrollViewRef.current && data.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [data.length]);

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // Extract values
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue || 1; // Prevent division by zero

  // Generate path for the line with fixed spacing
  const points = data.map((item, index) => {
    const x = paddingLeft + index * pointSpacing;
    const y = paddingTop + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
    return { x, y, value: item.value };
  });

  // Create SVG path
  let pathData = '';
  points.forEach((point, index) => {
    if (index === 0) {
      pathData += `M ${point.x} ${point.y}`;
    } else {
      pathData += ` L ${point.x} ${point.y}`;
    }
  });

  // Y-axis labels (these stay fixed)
  const yLabels = [
    { value: maxValue, y: paddingTop },
    { value: Math.round((maxValue + minValue) / 2), y: paddingTop + chartHeight / 2 },
    { value: minValue, y: paddingTop + chartHeight }
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.chartWrapper}>
        {/* Fixed Y-axis labels */}
        <View style={styles.yAxisContainer}>
          {yLabels.map((item, index) => (
            <View 
              key={`y-label-${index}`}
              style={[styles.yAxisLabel, { top: item.y }]}
            >
              <Text style={styles.yAxisText}>{Math.round(item.value)}</Text>
            </View>
          ))}
        </View>

        {/* Scrollable chart area */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.scrollView}
          contentContainerStyle={{ paddingRight: paddingRight }}
        >
          <Svg width={totalWidth} height={height}>
            {/* Grid lines */}
            {yLabels.map((item, index) => (
              <Line
                key={`grid-${index}`}
                x1={paddingLeft}
                y1={item.y}
                x2={paddingLeft + chartWidth}
                y2={item.y}
                stroke="#E0E0E0"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}

            {/* Main line path */}
            <Path
              d={pathData}
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data point dots */}
            {showDots && points.map((point, index) => (
              <Circle
                key={`dot-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
              />
            ))}

            {/* Time indicator at the end */}
            {data.length > 0 && (
              <SvgText
                x={paddingLeft + (data.length - 1) * pointSpacing}
                y={height - 10}
                fontSize="10"
                fill="#999"
                textAnchor="middle"
              >
                Now
              </SvgText>
            )}
          </Svg>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 10,
  },
  chartWrapper: {
    flexDirection: 'row',
    position: 'relative',
  },
  yAxisContainer: {
    width: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  yAxisLabel: {
    position: 'absolute',
    right: 8,
    transform: [{ translateY: -6 }],
  },
  yAxisText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default LineChart;
