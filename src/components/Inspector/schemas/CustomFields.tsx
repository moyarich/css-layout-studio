
import {
  ALargeSmall,
  AlignLeft,
  ArrowLeftRight,
  ArrowUpDown,
  Box,
  ChevronRight,
  Expand,
  Frame,
  Grid3X3,
  Grid2X2,
  LayoutDashboard,
  LocateFixed,
  MousePointerClick,
  MoveHorizontal,
  MoveVertical,
  Palette,
  PaintBucket,
  PanelTop,
  Radius,
  RotateCw,
  Rows3,
  Scaling,
  Scan,
  ScrollText,
  Shrink,
  SlidersHorizontal,
  Sparkles,
  Type,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { FieldProps, RegistryFieldsType } from "@rjsf/utils";
import type { ReactNode, SyntheticEvent } from "react";
import { INSPECTOR_FIELD_IDS, type InspectorFieldId } from "../inspector-model";

type InspectorFormContext = {
  visible?: string[];
  dataGroupIds?: string[];
  setGroupVisible?: (id: string, visible: boolean) => void;
};

type InspectorGroupType = "mode" | "role" | "category" | "property";

type InspectorGroupFieldProps = FieldProps & {
  groupType: InspectorGroupType;
  icon?: LucideIcon;
  title?: ReactNode;
  badge?: ReactNode;
  showCount?: boolean;
};

function collapsibleProps(props: FieldProps) {
  const id = String(props.schema.$id ?? props.name);

  const context = props.registry.formContext as
    | InspectorFormContext
    | undefined;

  const open = context?.visible ? context.visible.includes(id) : true;

  return {
    open,

    "data-has-preset": context?.dataGroupIds?.includes(id) || undefined,

    onToggle: (event: SyntheticEvent<HTMLDetailsElement>) => {
      const next = event.currentTarget.open;

      if (next !== open) {
        context?.setGroupVisible?.(id, next);
      }
    },
  };
}

function contentOnlySchema(props: FieldProps) {
  const { title: _title, description: _description, ...schema } = props.schema;

  return schema;
}

// #region Component: InspectorGroupField

function InspectorGroupField({
  groupType,
  icon: Icon,
  title,
  badge,
  showCount = false,
  ...props
}: InspectorGroupFieldProps) {
  const ObjectField = props.registry.fields.ObjectField;

  const count = Object.keys(props.schema.properties ?? {}).length;

  return (
    <details
      className="inspector-group"
      data-group-type={groupType}
      {...collapsibleProps(props)}
    >
      <summary className="inspector-group-header">
        {Icon && (
          <span className="inspector-group-icon">
            <Icon size={15} aria-hidden="true" />
          </span>
        )}

        <span className="inspector-group-title">
          <strong>{title ?? (props.schema.title as string)}</strong>

          {props.schema.description && (
            <small>{props.schema.description as string}</small>
          )}
        </span>

        {badge != null && (
          <span className="inspector-group-badge">{badge}</span>
        )}

        {showCount && <span className="inspector-group-count">{count}</span>}

        <ChevronRight
          className="inspector-group-chevron"
          size={14}
          aria-hidden="true"
        />
      </summary>

      <div className="inspector-group-body">
        <ObjectField {...props} schema={contentOnlySchema(props)} />
      </div>
    </details>
  );
}

// #endregion Component: InspectorGroupField


export const inspectorCustomFields: RegistryFieldsType = {
  // -------------------------------------------------------------------------
  // Layout mode
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.layoutMode]: (props) => (
    <InspectorGroupField
      {...props}
      groupType="mode"
      icon={LayoutDashboard}
      badge="mode"
    />
  ),

  // -------------------------------------------------------------------------
  // Layout roles
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.flexContainer]: (props) => (
    <InspectorGroupField
      {...props}
      groupType="role"
      icon={Rows3}
      title="Flex container"
      badge="container"
    />
  ),

  [INSPECTOR_FIELD_IDS.flexItem]: (props) => (
    <InspectorGroupField
      {...props}
      groupType="role"
      icon={PanelTop}
      title="Flex item"
      badge="item"
    />
  ),

  [INSPECTOR_FIELD_IDS.gridContainer]: (props) => (
    <InspectorGroupField
      {...props}
      groupType="role"
      icon={Grid3X3}
      title="Grid container"
      badge="container"
    />
  ),

  [INSPECTOR_FIELD_IDS.gridItem]: (props) => (
    <InspectorGroupField
      {...props}
      groupType="role"
      icon={Grid2X2}
      title="Grid item"
      badge="item"
    />
  ),

  // -------------------------------------------------------------------------
  // Top-level style categories
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.generalFields]: (props) => (
    <InspectorGroupField {...props} groupType="category" icon={SlidersHorizontal} />
  ),

  [INSPECTOR_FIELD_IDS.boxModel]: (props) => (
    <InspectorGroupField {...props} groupType="category" icon={Box} />
  ),

  [INSPECTOR_FIELD_IDS.typography]: (props) => (
    <InspectorGroupField {...props} groupType="category" icon={Type} />
  ),

  [INSPECTOR_FIELD_IDS.appearance]: (props) => (
    <InspectorGroupField {...props} groupType="category" icon={Palette} />
  ),

  // -------------------------------------------------------------------------
  // Appearance property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.appearanceBackground]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={PaintBucket} showCount />
  ),

  [INSPECTOR_FIELD_IDS.appearanceBorder]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Frame} showCount />
  ),

  [INSPECTOR_FIELD_IDS.appearanceRadius]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Radius} showCount />
  ),

  [INSPECTOR_FIELD_IDS.appearanceEffects]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Sparkles} showCount />
  ),

  [INSPECTOR_FIELD_IDS.appearanceOutline]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Scan} showCount />
  ),

  // -------------------------------------------------------------------------
  // Box model property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.boxPosition]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={LocateFixed} showCount />
  ),

  [INSPECTOR_FIELD_IDS.boxOverflow]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={ScrollText} showCount />
  ),

  // -------------------------------------------------------------------------
  // Typography property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.typographyFont]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={ALargeSmall} showCount />
  ),

  [INSPECTOR_FIELD_IDS.typographyText]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={AlignLeft} showCount />
  ),

  // -------------------------------------------------------------------------
  // Layout property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.layoutFlow]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Workflow} showCount />
  ),

  [INSPECTOR_FIELD_IDS.layoutTransform]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={RotateCw} showCount />
  ),

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.interaction]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={MousePointerClick} showCount />
  ),

  // -------------------------------------------------------------------------
  // Sizing property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.sizeWidth]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={MoveHorizontal} showCount />
  ),

  [INSPECTOR_FIELD_IDS.sizeHeight]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={MoveVertical} showCount />
  ),

  [INSPECTOR_FIELD_IDS.sizeInline]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={ArrowLeftRight} showCount />
  ),

  [INSPECTOR_FIELD_IDS.sizeBlock]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={ArrowUpDown} showCount />
  ),

  [INSPECTOR_FIELD_IDS.sizeBehavior]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Scaling} showCount />
  ),

  // -------------------------------------------------------------------------
  // Spacing property groups
  // -------------------------------------------------------------------------

  [INSPECTOR_FIELD_IDS.spaceMargin]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Expand} showCount />
  ),

  [INSPECTOR_FIELD_IDS.spacePadding]: (props) => (
    <InspectorGroupField {...props} groupType="property" icon={Shrink} showCount />
  ),
};
