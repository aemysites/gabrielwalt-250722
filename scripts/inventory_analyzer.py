#!/usr/bin/env python3
"""
Inventory Analyzer for EDS Block Optimization Priority
Generates priority list based on usage frequency × visual impact
"""

import json
import sys
from collections import defaultdict

def analyze_inventory(inventory_file):
    """Analyze inventory.json to generate optimization priority list"""
    
    with open(inventory_file, 'r') as f:
        data = json.load(f)
    
    # Baseline visual impact data (from rapid_visual_diff analysis)
    visual_impact = {
        'header': 319974,
        'cards': 638664,  # Highest single instance impact
        'hero': 1,        # Nearly perfect
        'columns': 250000,  # Estimated
        'teaser': 200000,   # Estimated
    }
    
    block_stats = defaultdict(lambda: {'instances': 0, 'variations': set(), 'total_impact': 0})
    
    # Process blocks from inventory
    if 'blocks' in data:
        for block in data['blocks']:
            name = block['name'].lower()
            instances = len(block.get('instances', []))
            variant_key = block.get('key', 'default')
            
            block_stats[name]['instances'] += instances
            block_stats[name]['variations'].add(variant_key)
            
            # Calculate total impact: instances × visual_difference
            base_impact = visual_impact.get(name, 100000)  # Default estimate
            block_stats[name]['total_impact'] += instances * base_impact
    
    # Process fragments (like nav)
    if 'fragments' in data:
        for fragment in data['fragments']:
            name = fragment['name'].lower()
            instances = len(fragment.get('instances', []))
            
            if name == 'nav':
                name = 'header'  # Nav is part of header
            
            block_stats[name]['instances'] += instances
            block_stats[name]['variations'].add('fragment')
            
            base_impact = visual_impact.get(name, 50000)
            block_stats[name]['total_impact'] += instances * base_impact
    
    # Generate priority list
    priority_list = []
    for name, stats in block_stats.items():
        priority_list.append({
            'block': name,
            'instances': stats['instances'],
            'variations': len(stats['variations']),
            'variation_names': list(stats['variations']),
            'total_impact': stats['total_impact'],
            'avg_impact_per_instance': stats['total_impact'] // max(stats['instances'], 1)
        })
    
    # Sort by total impact (highest first)
    priority_list.sort(key=lambda x: x['total_impact'], reverse=True)
    
    return priority_list

def print_priority_analysis(priority_list):
    """Print formatted priority analysis"""
    
    print("=" * 80)
    print("EDS BLOCK OPTIMIZATION PRIORITY ANALYSIS")
    print("=" * 80)
    print(f"{'Block':<15} {'Instances':<10} {'Variations':<12} {'Total Impact':<15} {'Priority':<10}")
    print("-" * 80)
    
    for i, item in enumerate(priority_list[:10]):
        priority = f"P{i+1}"
        variations_str = f"{item['variations']} ({', '.join(item['variation_names'][:2])}{'...' if item['variations'] > 2 else ''})"
        
        print(f"{item['block']:<15} {item['instances']:<10} {variations_str:<12} {item['total_impact']:<15,} {priority:<10}")
    
    print("-" * 80)
    print("\nTOP 5 RECOMMENDATIONS:")
    for i, item in enumerate(priority_list[:5]):
        print(f"{i+1}. {item['block'].title()}: {item['total_impact']:,} total impact "
              f"({item['instances']} instances × {item['avg_impact_per_instance']:,} avg impact)")
    
    print("\n🎯 AUTONOMOUS WORK FOCUS:")
    print(f"Start with: {priority_list[0]['block'].title()} (Highest impact: {priority_list[0]['total_impact']:,})")
    
    return priority_list

if __name__ == "__main__":
    inventory_file = sys.argv[1] if len(sys.argv) > 1 else "tools/importer/inventory.json"
    
    try:
        priority_list = analyze_inventory(inventory_file)
        print_priority_analysis(priority_list)
        
        # Save analysis to file
        with open('/workspace/tmp/priority_analysis.json', 'w') as f:
            json.dump(priority_list, f, indent=2)
        
        print(f"\n✅ Priority analysis saved to: /workspace/tmp/priority_analysis.json")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)